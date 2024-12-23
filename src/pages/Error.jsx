import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
import Button from '../components/Button'

const Error = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 flex items-center justify-center'>
      <div className='text-center space-y-6 max-w-lg mx-auto'>
        <h1 className='text-6xl font-bold text-blue-600'>Oops!</h1>
        <p className='text-xl text-gray-600'>
          {error?.message || 'Sorry, an unexpected error occurred.'}
        </p>
        <div className='pt-4'>
          <Button 
            content="Go Back" 
            handleClick={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  )
}

export default Error