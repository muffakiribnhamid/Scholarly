import React, { useEffect, useState } from 'react'
import { useUserContext } from '../context/AppContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { FiUser, FiBook, FiAward } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    displayName: '',
    school: '',
    grade: '',
    totalTasks: 0,
    completedTasks: 0,
    focusedSessions: 0
  })
  const [loading, setLoading] = useState(true)
  const [quote, setQuote] = useState('')
  const [quoteLoading, setQuoteLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setQuoteLoading(true)
        const response = await fetch('https://api.freeapi.app/api/v1/public/quotes/quote/random')
        const data = await response.json()
        
        if (data.success && data.data && data.data.content) {
          setQuote(data.data.content)
        } else {
          setQuote('Success is not final, failure is not fatal: it is the courage to continue that counts.')
        }
      } catch (error) {
        console.error('Error fetching quote:', error)
        setQuote('Success is not final, failure is not fatal: it is the courage to continue that counts.')
      } finally {
        setQuoteLoading(false)
      }
    }

    fetchQuote()
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) {
          navigate('/login')
          return
        }

        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setProfileData({
            displayName: userData.displayName || '',
            school: userData.school || '',
            grade: userData.grade || '',
            totalTasks: userData.tasks?.length || 0,
            completedTasks: userData.totalTasksCompleted || 0,
            focusedSessions: userData.focusedSessions || 0
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white p-4 rounded-full shadow-md">
            <FiUser size={40} className="text-blue-600" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{profileData.displayName}</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <FiBook size={16} />
                <span>{profileData.school}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-blue-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <FiAward size={16} />
                <span>Grade {profileData.grade}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <img width={30} height={30} src="./src/assets/task.png" alt="" className="opacity-75" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">{profileData.totalTasks}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Tasks</h3>
          <p className="text-sm text-gray-500 mt-1">All tasks created</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <img width={30} height={30} src="./src/assets/checklist.png" alt="" className="opacity-75" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-green-600">{profileData.completedTasks}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Completed Tasks</h3>
          <p className="text-sm text-gray-500 mt-1">Tasks finished successfully</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <img width={30} height={30} src="./src/assets/session.png" alt="" className="opacity-75" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-purple-600">{profileData.focusedSessions}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Focus Sessions</h3>
          <p className="text-sm text-gray-500 mt-1">Total focused sessions</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-full">
            <p className="text-gray-700 text-base sm:text-lg font-medium italic">
              {quoteLoading ? (
                <span className="animate-pulse">Loading quote...</span>
              ) : (
                quote
              )}
            </p>
            <p className="text-gray-500 mt-2 text-sm">Daily Inspiration</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile