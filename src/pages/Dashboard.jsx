import React from 'react'
import SidePanel from '../components/SidePanel'
import { Outlet } from 'react-router-dom'
import Pomodoro from './Pomodoro'
import AIAssistant from './AIAssistant'
import Statistics from './Statistics'
import MyProfile from './MyProfile'

const Dashboard = () => {
    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            <div className='md:w-64 w-full'>
                <SidePanel />
            </div>
            <main className='flex-1 p-4 md:p-8'>
                <Outlet />
            </main>
        </div>
    )
}

export default Dashboard