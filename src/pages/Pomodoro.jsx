import React, { useEffect, useState } from 'react'
import { FiPlay, FiPause, FiRefreshCw, FiMinus, FiPlus, FiMaximize, FiMinimize } from 'react-icons/fi'
import { doc, updateDoc, getDoc, arrayUnion, increment } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useUserContext } from '../context/AppContext'

const Pomodoro = () => {
  const { user } = useUserContext()
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sessionLength, setSessionLength] = useState(25)
  const [breakLength, setBreakLength] = useState(5)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleStart = () => {
    setIsRunning(true)
    toggleFullscreen()
  }

  const handlePause = () => {
    setIsRunning(false)
  }
  
  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(sessionLength * 60)
    setIsBreak(false)
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  const updateFirestore = async () => {
    if (!user) return

    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      const currentDate = new Date().toISOString().split('T')[0]
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          focusedSessions: increment(1),
          sessionHistory: arrayUnion({
            date: currentDate,
            duration: sessionLength,
            completedAt: new Date().toISOString()
          })
        })
      }
    } catch (error) {
      console.error('Error updating session data:', error)
    }
  }

  const handleBreakOrSessionEnd = () => {
    const audio = new Audio('/notification.mp3')
    audio.play()

    if (isBreak) {
      setIsBreak(false)
      setTimeLeft(sessionLength * 60)
    } else {
      setSessionsCompleted(prev => prev + 1)
      setIsBreak(true)
      setTimeLeft(breakLength * 60)
      updateFirestore()
    }
  }

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleBreakOrSessionEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, isBreak, breakLength, sessionLength])

  const adjustLength = (type, amount) => {
    if (isRunning) return

    if (type === 'break') {
      const newLength = Math.max(1, Math.min(60, breakLength + amount))
      setBreakLength(newLength)
      if (isBreak) setTimeLeft(newLength * 60)
    } else {
      const newLength = Math.max(1, Math.min(60, sessionLength + amount))
      setSessionLength(newLength)
      if (!isBreak) setTimeLeft(newLength * 60)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className={`transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 bg-white z-50 flex items-center justify-center' : 'max-w-2xl mx-auto px-4 py-8'
    }`}>
      <div className={isFullscreen ? 'text-center' : ''}>
        <div className={`text-center ${isFullscreen ? 'mb-8' : 'mb-12'}`}>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            {isBreak ? 'Break Time!' : 'Pomodoro Timer'}
          </h1>
          <p className="text-gray-600">
            {isBreak ? 'Take a short break and relax' : 'Stay focused and productive'}
          </p>
        </div>

        <div className={`bg-white rounded-2xl shadow-lg p-8 mb-8 ${isFullscreen ? 'max-w-xl mx-auto' : ''}`}>
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg mb-4">{isBreak ? 'Break' : 'Session'}</p>
            <h1 className="text-8xl font-bold text-gray-800 mb-8">{formatTime(timeLeft)}</h1>
            <div className="flex items-center justify-center gap-4">
              {!isRunning ? (
                <button onClick={handleStart} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FiPlay className="text-lg" />
                  Start
                </button>
              ) : (
                <button onClick={handlePause} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FiPause className="text-lg" />
                  Pause
                </button>
              )}
              <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FiRefreshCw className="text-lg" />
                Reset
              </button>
              <button onClick={toggleFullscreen} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                {isFullscreen ? <FiMinimize className="text-lg" /> : <FiMaximize className="text-lg" />}
              </button>
            </div>
          </div>

          {!isFullscreen && (
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-4 mb-2">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => adjustLength('break', -1)}
                      disabled={isRunning}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <FiMinus className="text-gray-600" />
                    </button>
                    <span className="text-3xl font-bold text-gray-800">{breakLength}</span>
                    <button 
                      onClick={() => adjustLength('break', 1)}
                      disabled={isRunning}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <FiPlus className="text-gray-600" />
                    </button>
                  </div>
                  <p className="text-gray-600">Break Length</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-4 mb-2">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => adjustLength('session', -1)}
                      disabled={isRunning}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <FiMinus className="text-gray-600" />
                    </button>
                    <span className="text-3xl font-bold text-gray-800">{sessionLength}</span>
                    <button 
                      onClick={() => adjustLength('session', 1)}
                      disabled={isRunning}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <FiPlus className="text-gray-600" />
                    </button>
                  </div>
                  <p className="text-gray-600">Session Length</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isFullscreen && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm">
              The Pomodoro Technique helps you stay focused and productive. 
              Work for {sessionLength} minutes, then take a {breakLength}-minute break. Repeat the cycle!
            </p>
            {sessionsCompleted > 0 && (
              <p className="text-blue-600 font-medium mt-2">
                Sessions completed today: {sessionsCompleted}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pomodoro