import React, { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiBell, FiMoon, FiSun, FiSave, FiLoader } from 'react-icons/fi'

const Settings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    displayName: '',
    email: '',
    school: '',
    grade: '',
    notifications: {
      email: true,
      taskReminders: true,
      studyReminders: true
    },
    preferences: {
      darkMode: false,
      focusTime: 25,
      breakTime: 5,
      dailyGoal: 4
    }
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const fetchSettings = async () => {
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
          setSettings(prevSettings => ({
            ...prevSettings,
            displayName: user.displayName || '',
            email: user.email || '',
            school: userData.school || '',
            grade: userData.grade || '',
            notifications: {
              ...prevSettings.notifications,
              ...userData.notifications
            },
            preferences: {
              ...prevSettings.preferences,
              ...userData.preferences
            }
          }))
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        setMessage({ type: 'error', text: 'Failed to load settings' })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [navigate])

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const user = auth.currentUser
      if (!user) return

      // Update auth profile
      await updateProfile(user, {
        displayName: settings.displayName
      })

      // Update Firestore document
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        displayName: settings.displayName,
        school: settings.school,
        grade: settings.grade,
        notifications: settings.notifications,
        preferences: settings.preferences
      })

      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiUser className="w-5 h-5" />
            Profile Settings
          </h2>
          
          <div className="space-y-4">
            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings(prev => ({...prev, displayName: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={settings.school}
                  onChange={(e) => setSettings(prev => ({...prev, school: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  value={settings.grade}
                  onChange={(e) => setSettings(prev => ({...prev, grade: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        
        {/* Preferences Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiSun className="w-5 h-5" />
            Study Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Dark Mode</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.preferences.darkMode}
                  onChange={(e) => handleInputChange('preferences', 'darkMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.preferences.focusTime}
                onChange={(e) => handleInputChange('preferences', 'focusTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.preferences.breakTime}
                onChange={(e) => handleInputChange('preferences', 'breakTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Focus Sessions Goal
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.preferences.dailyGoal}
                onChange={(e) => handleInputChange('preferences', 'dailyGoal', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings