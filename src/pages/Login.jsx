import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FiMail, FiLock } from 'react-icons/fi'
import Button from '../components/Button'
import Input from '../components/Input'
import { auth } from '../firebase/config'
import Loader from '../components/Loader'

const Login = () => {
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [startLoading, setStartLoading] = useState(true)
    const navigate = useNavigate()

    setTimeout(() => {
        setStartLoading(false)
    }, 2000);

    // Check if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn')) {
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
    }

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault()
        const { email, password } = formData
        
        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            setError('')
            
            // Sign in user
            await signInWithEmailAndPassword(auth, email, password)
            
            // Clear form fields
            setFormData({
                email: '',
                password: ''
            })
            
            navigate('/setup-student')
        } catch (err) {
            // Handle specific Firebase errors
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password')
            } else {
                setError('Something went wrong. Please try again.')
            }
            console.error('Login error:', err)
        } finally {
            setLoading(false)
            localStorage.setItem('isLoggedIn', true)

        }
    }

    if(startLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 flex items-center justify-center'>
                <div className='text-center space-y-6 max-w-lg mx-auto'>
                    <Loader/>
                </div>
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
                                Welcome to{' '}
                                <span className='text-blue-600 hover:text-blue-700 transition-colors duration-300'>
                                    Scholarly!
                                </span>
                            </h1>
                            <p className='text-lg text-gray-600'>
                                Please enter your details to log in.
                            </p>
                        </div>
                        
                        <form onSubmit={handleLogin} className='space-y-6'>
                            <Input 
                                type="email" 
                                placeholder="Email Address" 
                                name="email"
                                icon={FiMail}
                                onChange={handleChange}
                                value={formData.email}
                            />
                            <Input 
                                type="password" 
                                placeholder="Enter Password" 
                                name="password"
                                icon={FiLock}
                                onChange={handleChange}
                                value={formData.password}
                            />

                            {error && (
                                <p className='text-red-500 text-sm font-medium'>
                                    {error}
                                </p>
                            )}
                            
                            <div className='pt-2'>
                                <Button 
                                    content={loading ? 'Logging In...' : 'Log In'}
                                    type="submit"
                                    disabled={loading}
                                />
                            </div>
                            
                            <p className='text-sm text-gray-500 pt-4'>
                                Don't have an account?{' '}
                                <a onClick={() => navigate('/create-account')} className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'>
                                    Sign Up
                                </a>
                            </p>
                        </form>
                    </div>
                    
                    <div className='relative group hidden md:block'>
                        <div className='absolute -inset-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300'></div>
                        <div className='absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition-transform duration-300'></div>
                        <img 
                            className='relative rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-[1.01] w-full h-auto max-w-lg mx-auto' 
                            src="./src/assets/asset2.png" 
                            alt="Study Smart with Scholarly" 
                            width={600} 
                            height={600}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login