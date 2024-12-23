import React, { useState } from 'react'
import {auth,db} from '../firebase/config'
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'
import { FiX, FiLoader } from 'react-icons/fi';

const Addtask = ({isOpen, onClose, onTaskAdded}) => {
    const [taskData,setTaskData] = useState({
        title : '',
        description : '',
        dueDate : '',
        subject: '',
        priority: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const resetForm = () => {
        setTaskData({
            title: '',
            description: '',
            dueDate: '',
            subject: '',
            priority: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true)

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('User not logged in');
                return;
            }

            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            const newTask = {
                ...taskData,
                id: Date.now(),
                createdAt : new Date().toISOString(),
                status: 'pending'
            }
            
            if(userDoc.exists()) {
                await updateDoc(userRef, {
                    tasks : arrayUnion(newTask)
                });
            } else {
                await setDoc(userRef, {
                    tasks : [newTask]
                });
            }

            onTaskAdded(newTask);
            resetForm();
            onClose();
            
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        } finally {
            setIsSubmitting(false)
        }
    }

    if(!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              className="w-full p-2 border rounded-lg"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Due Date</label>
            <input
              type="datetime-local"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={taskData.subject}
              onChange={(e) => setTaskData({...taskData, subject: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Priority</label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

        

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Addtask
