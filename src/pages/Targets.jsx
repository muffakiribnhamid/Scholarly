import React, { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useUserContext } from '../context/AppContext'
import { FiPlus, FiCheck, FiTrash2 } from 'react-icons/fi'

const Targets = () => {
  const { user } = useUserContext()
  const [targets, setTargets] = useState([])
  const [newTarget, setNewTarget] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTargets()
  }, [user])

  const fetchTargets = async () => {
    if (!user) return
    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists() && userDoc.data().targets) {
        setTargets(userDoc.data().targets)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching targets:', error)
      setLoading(false)
    }
  }

  const addTarget = async (e) => {
    e.preventDefault()
    if (!newTarget.trim() || !user) return

    const target = {
      id: Date.now(),
      text: newTarget.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        targets: arrayUnion(target)
      })
      setTargets([...targets, target])
      setNewTarget('')
    } catch (error) {
      console.error('Error adding target:', error)
    }
  }

  const toggleTarget = async (targetId) => {
    try {
      const updatedTargets = targets.map(target => 
        target.id === targetId 
          ? { ...target, completed: !target.completed }
          : target
      )
      
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        targets: updatedTargets
      })
      setTargets(updatedTargets)
    } catch (error) {
      console.error('Error updating target:', error)
    }
  }

  const deleteTarget = async (targetId) => {
    try {
      const updatedTargets = targets.filter(target => target.id !== targetId)
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        targets: updatedTargets
      })
      setTargets(updatedTargets)
    } catch (error) {
      console.error('Error deleting target:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Study Targets</h1>
        <p className="text-gray-600">Set and track your academic goals</p>
      </div>

      <form onSubmit={addTarget} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Add a new target..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors sm:w-auto w-full"
          >
            <FiPlus className="text-lg" />
            <span>Add Target</span>
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {targets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No targets set yet. Add your first target above!</p>
          </div>
        ) : (
          targets.map(target => (
            <div
              key={target.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleTarget(target.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    target.completed
                      ? 'bg-green-500 text-white'
                      : 'border-2 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {target.completed && <FiCheck size={14} />}
                </button>
                <span className={`flex-1 ${target.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {target.text}
                </span>
              </div>
              <button
                onClick={() => deleteTarget(target.id)}
                className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {targets.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Completed: {targets.filter(t => t.completed).length} / {targets.length}
          </p>
        </div>
      )}
    </div>
  )
}

export default Targets