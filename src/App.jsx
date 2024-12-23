import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WelcomeScreen from './pages/WelcomeScreen'
import CreateAccount from './pages/CreateAccount'
import { UserProvider } from './context/AppContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SetupStudent from './pages/SetupStudent'
import Error from './pages/Error'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import AIAssistant from './pages/AIAssistant'
import MyProfile from './pages/MyProfile'
import Tasks from './pages/Tasks'
import Statistics from './pages/Statistics'
import Pomodoro from './pages/Pomodoro'
import Settings from './pages/Settings'
import Targets from './pages/Targets'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <WelcomeScreen />,
      errorElement: <Error />
    },
    {
      path: '/create-account',
      element: <CreateAccount />
    },
    {
      path: '/setup-student',
      element: <SetupStudent />
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
      children: [
        {
          path: '',
          element: <MyProfile />
        },
        {
          path: 'tasks',
          element: <Tasks />
        },
        {
          path: 'statistics',
          element: <Statistics />
        },
        {
          path: 'learn-with-ai',
          element: <AIAssistant />
        }
        ,
        {
          path: 'pomodoro',
          element: <Pomodoro />
        },
        {
          path: 'settings',
          element: <Settings />
        },
        {
          path: 'targets',
          element: <Targets/>
        }



      ]
    },
    {
      path: '/login',
      element: <Login />
    },
  ])

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App
