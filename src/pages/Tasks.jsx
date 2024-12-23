import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Addtask from '../models/Addtask'
import { auth, db } from '../firebase/config'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { FiCheck, FiRotateCcw, FiPlus } from 'react-icons/fi'

const Tasks = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tasksToRemove, setTasksToRemove] = useState([])

  const toggleTaskStatus = async (taskToUpdate) => {
    try {
      const user = auth.currentUser
      if (!user) return
      const userRef = doc(db, 'users', user.uid)

      if (taskToUpdate.status !== 'completed') {
        setTasksToRemove(prev => [...prev, taskToUpdate.id])
        
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        
        const completedTask = {
          taskId: taskToUpdate.id,
          title: taskToUpdate.title,
          subject: taskToUpdate.subject,
          completedAt: new Date().toISOString(),
          dayCompleted: new Date().toLocaleDateString()
        }

        setTimeout(async () => {
          await updateDoc(userRef, {
            tasks: arrayRemove(taskToUpdate),
            completedTasks: arrayUnion(completedTask),
            totalTasksCompleted: (userData.totalTasksCompleted || 0) + 1
          })

          // Update local state
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToUpdate.id))
          setTasksToRemove(prev => prev.filter(id => id !== taskToUpdate.id))
        }, 500)
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
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
          setTasks(userData.tasks || [])
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setLoading(false)
      }
    }

    fetchTasks()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage your assignments and homework</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus className="text-lg" />
          Add New Task
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12">
            <p className="text-gray-500 mb-4">No tasks yet. Start by adding a new task!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <FiPlus className="text-lg" />
              Add Task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all transform ${
                tasksToRemove.includes(task.id)
                  ? 'scale-95 opacity-0'
                  : 'scale-100 opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{task.subject}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-600'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className="text-green-500 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <FiCheck size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <Addtask
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={(newTask) => setTasks(prev => [...prev, newTask])}
        />
      )}
    </div>
  )
}

export default Tasks