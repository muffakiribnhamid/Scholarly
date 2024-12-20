import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WelcomeScreen from './pages/WelcomeScreen'
import CreateAccount from './pages/CreateAccount'
import { UserProvider } from './context/AppContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserProvider>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<WelcomeScreen />} />
            <Route path='/create-account' element={<CreateAccount />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
    </>
  )
}

export default App
