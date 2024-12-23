import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiCheckSquare, FiBarChart2, FiTarget, FiClock, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { RiBrain2Fill } from "react-icons/ri";
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Tasks', icon: FiCheckSquare, path: '/dashboard/tasks' },
    { name: 'Statistics', icon: FiBarChart2, path: '/dashboard/statistics' },
    { name: 'Targets', icon: FiTarget, path: '/dashboard/targets' },
    { name: 'Pomodoro', icon: FiClock, path: '/dashboard/pomodoro' },
    { name: 'Learn with AI', icon: RiBrain2Fill, path: '/dashboard/learn-with-ai' },
    { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
]

const SidePanel = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await signOut(auth)
            navigate('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
        finally {
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('isAccountCreated')
            localStorage.removeItem('isAccountSetup')
        }
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='bg-white border-r border-gray-200 md:h-screen'>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                    Scholarly
                </h1>
                <button 
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block p-6">
                <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                    Scholarly
                </h1>
            </div>

            {/* Navigation Menu - Responsive */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
                <nav className='flex-1 px-4 space-y-1 py-4'>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    navigate(item.path)
                                    setIsOpen(false)
                                }}
                                className={`
                                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                                    transition-all duration-200
                                    ${isActive 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <item.icon size={20} />
                                <span className='font-medium'>{item.name}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                            text-gray-600 hover:bg-gray-50 transition-all duration-200
                        "
                    >
                        <FiLogOut size={20} />
                        <span className='font-medium'>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SidePanel