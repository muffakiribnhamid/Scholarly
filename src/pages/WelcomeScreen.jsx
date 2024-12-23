import React, { useEffect } from 'react'
import Button from '../components/Button'
import { useUserContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const WelcomeScreen = () => {
    const {isOnBoarded, setIsOnBoarded} = useUserContext()
    const navigate = useNavigate()

    //check if user is already on boarded
    useEffect(() => {
        const isUserOnBoarded = localStorage.getItem('isOnBoarded')
        if (isUserOnBoarded) {
            setIsOnBoarded(true)
            navigate('/create-account')
        }
    }, [])

    const handleClick = () => {
        setIsOnBoarded(true)
        localStorage.setItem('isOnBoarded', true)
        navigate('/create-account')
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-blue-50 px-4'>
      <div className='max-w-7xl mx-auto h-screen flex items-center'>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-8 md:pr-8">
            <div className='space-y-4'>
              <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
                Welcome to{' '}
                <span className='text-blue-600 hover:text-blue-700 transition-colors duration-300'>
                  Scholarly!
                </span>
              </h1>
              <p className='text-lg md:text-xl text-gray-600 max-w-md'>
                Simplify Your Studies, Amplify Your Productivity. Stay Focused!
              </p>
            </div>
            <div className='pt-4'>
              <Button  handleClick={handleClick}/>
            </div>
          </div>
          
          <div className='relative group'>
            <div className='absolute inset-0 bg-blue-100 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300'></div>
            <img 
              className='relative rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]' 
              src="./src/assets/asset1.png" 
              alt="Scholarly Learning Platform" 
              width={600} 
              height={600}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen