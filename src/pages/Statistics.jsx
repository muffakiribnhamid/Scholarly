import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { FiLoader } from 'react-icons/fi'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const Statistics = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [taskStats, setTaskStats] = useState([])
    const [focusStats, setFocusStats] = useState([])
    const [categoryStats, setCategoryStats] = useState([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = auth.currentUser
                if (!user) {
                    navigate('/login')
                    return
                }

                const userRef = doc(db, 'users', user.uid)
                const userDoc = await getDoc(userRef)
                
                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    
                    // Process tasks data for weekly stats
                    const tasks = userData.tasks || []
                    const completedTasks = userData.completedTasks || []
                    
                    // Weekly task completion stats
                    const weeklyStats = processWeeklyStats(tasks, completedTasks)
                    setTaskStats(weeklyStats)

                    // Focus session stats
                    const focusSessions = userData.focusSessions || []
                    const focusData = processFocusStats(focusSessions)
                    setFocusStats(focusData)

                    // Task category distribution
                    const categoryData = processCategoryStats(tasks)
                    setCategoryStats(categoryData)
                }
            } catch (error) {
                console.error('Error fetching statistics:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [navigate])

    const processWeeklyStats = (tasks, completedTasks) => {
        const weeks = {}
        const today = new Date()
        
        // Process completed tasks
        completedTasks.forEach(task => {
            const completedDate = new Date(task.completedAt)
            const weekDiff = Math.floor((today - completedDate) / (7 * 24 * 60 * 60 * 1000))
            const weekKey = `Week ${weekDiff + 1}`
            
            if (!weeks[weekKey]) {
                weeks[weekKey] = { completed: 0, total: 0 }
            }
            weeks[weekKey].completed++
        })

        // Process all tasks
        tasks.forEach(task => {
            const createdDate = new Date(task.createdAt)
            const weekDiff = Math.floor((today - createdDate) / (7 * 24 * 60 * 60 * 1000))
            const weekKey = `Week ${weekDiff + 1}`
            
            if (!weeks[weekKey]) {
                weeks[weekKey] = { completed: 0, total: 0 }
            }
            weeks[weekKey].total++
        })

        // Convert to array and calculate performance
        return Object.entries(weeks)
            .map(([week, stats]) => ({
                week,
                performance: (stats.completed / stats.total) * 100 || 0,
                completed: stats.completed,
                total: stats.total
            }))
            .sort((a, b) => b.week.localeCompare(a.week))
            .slice(0, 4)
            .reverse()
    }

    const processFocusStats = (sessions) => {
        const dailyFocus = {}
        
        sessions.forEach(session => {
            const date = new Date(session.date).toLocaleDateString()
            dailyFocus[date] = (dailyFocus[date] || 0) + session.duration
        })

        return Object.entries(dailyFocus)
            .map(([date, duration]) => ({
                date,
                minutes: Math.round(duration / 60)
            }))
            .slice(-7)
    }

    const processCategoryStats = (tasks) => {
        const categories = {}
        
        tasks.forEach(task => {
            const category = task.category || 'Uncategorized'
            categories[category] = (categories[category] || 0) + 1
        })

        return Object.entries(categories)
            .map(([name, value]) => ({ name, value }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Study Statistics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Performance Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Task Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={taskStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="performance" name="Completion Rate (%)" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Focus Time Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Daily Focus Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={focusStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="minutes" 
                                name="Minutes Focused"
                                stroke="#82ca9d" 
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Categories Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Task Categories</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryStats}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Statistics