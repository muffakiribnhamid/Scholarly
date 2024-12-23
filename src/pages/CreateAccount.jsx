import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { FiUser, FiMail, FiLock } from 'react-icons/fi'
import Button from '../components/Button'
import Input from '../components/Input'
import { auth } from '../firebase/config'
import { useUserContext } from '../context/AppContext'
import Loader from '../components/Loader'
import { images } from '../utils/images'

const CreateAccount = () => {

    const navigate = useNavigate()
    const { name, setName } = useUserContext()
    const [MainLoading, setMainLoading] = useState(true)


    setTimeout(() => {
        setMainLoading(false)
    }, 2000);
    
    //if user is logged in, redirect to dashboard
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Check if user is already logged in
    useEffect(() => {
        if (auth.currentUser) {
            navigate('/setup-student')
        }
    }, [navigate])

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setName(value)
    }

    // Handle form submission
    const handleCreateAccount = async (e) => {
        e.preventDefault()
        const { name, email, password } = formData
        
        // Basic validation
        if (!email || !password || !name) {
            setError('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            setError('')
            
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            
            // Update user profile with display name
            await updateProfile(userCredential.user, {
                displayName: name
            })
            
            // Clear form fields
            setFormData({
                name: '',
                email: '',
                password: ''
            })
            
            navigate('/setup-student')
        } catch (err) {
            // Handle specific Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered')
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters')
            } else {
                setError('Something went wrong. Please try again.')
            }
            console.error('Signup error:', err)
        } finally {
            setLoading(false)
            localStorage.setItem('isAccountCreated', true)
        }
    }

    if(localStorage.getItem('isAccountCreated')) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-lg mx-auto'>
                    <h1 className='text-6xl font-bold text-blue-600'>Oops!</h1>
                    <p className='text-xl text-gray-600'>
                        You have already created an account.
                    </p>
                    <div className='pt-4 items-center'>
                        <Button 
                            content="Go Back" 
                            handleClick={() => navigate('/dashboard')}
                        />
                    </div>
                </div>
            </div>
        )
    }


    if(MainLoading) { 
        return(
            <div className='min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 flex items-center justify-center'>
                <Loader />
            </div>
        )
    }


    return (
        <div className='min-h-screen bg-gradient-to-br from-white to-blue-50 px-4'>
            <div className='max-w-7xl mx-auto h-screen flex items-center'>
                <div className="grid md:grid-cols-2 gap-12 items-center w-full">
                    <div className="space-y-8 md:pr-12 max-w-md">
                        <div className='space-y-4'>
                            <h1 className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                                Join Scholarly
                            </h1>
                            <p className='text-lg text-gray-600'>
                                Start your journey to better productivity and focused learning.
                            </p>
                        </div>
                        
                        <form onSubmit={handleCreateAccount} className='space-y-6'>
                            <Input 
                                type="text" 
                                placeholder="Full Name" 
                                name="name"
                                icon={FiUser}
                                onChange={handleChange}
                            />
                            <Input 
                                type="email" 
                                placeholder="Email Address" 
                                name="email"
                                icon={FiMail}
                                onChange={handleChange}
                            />
                            <Input 
                                type="password" 
                                placeholder="Create Password" 
                                name="password"
                                icon={FiLock}
                                onChange={handleChange}
                            />

                            {error && (
                                <p className='text-red-500 text-sm font-medium'>
                                    {error}
                                </p>
                            )}
                            
                            <div className='pt-2'>
                                <Button 
                                    content={loading ? 'Creating...' : 'Create Account'}
                                    handleClick={handleCreateAccount}
                                    disabled={loading}
                                />
                            </div>
                            
                            <p className='text-sm text-gray-500 pt-4'>
                                Already have an account?{' '}
                                <a onClick={() => navigate('/login')} className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'>
                                    Sign In
                                </a>
                            </p>
                        </form>
                    </div>
                    
                    <div className='relative group hidden md:block'>
                        <div className='absolute -inset-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300'></div>
                        <div className='absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition-transform duration-300'></div>
                        <img
                            className='relative rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]'
                            src={images.asset2}
                            alt="Create Account Illustration"
                            width={600}
                            height={600}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount