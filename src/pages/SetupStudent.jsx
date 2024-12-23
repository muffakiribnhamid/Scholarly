import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiBook, FiAward, FiBookOpen, FiMapPin } from 'react-icons/fi'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import Input from '../components/Input'
import Button from '../components/Button'
import { useUserContext } from '../context/AppContext'
import Loader from '../components/Loader'
import { images } from '../utils/images'

const SUBJECTS = [
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'English',
    'Computer Science',
    'History',
    'Geography',
    'Economics',
    'Literature',
    'Art',
    'Music'
]

const GRADES = [
    '6th Grade',
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade',
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
]

const COUNTRIES = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'India',
    'Germany',
    'France',
    'Japan',
    'China',
    'Brazil',
    'South Africa',
    'New Zealand',
    'Singapore',
    'Malaysia',
    'UAE'
]



const SetupStudent = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        school: '',
        grade: '',
        subjects: [],
        country: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [startLoading, setStartLoading] = useState(true)

    setTimeout(() => { 
        if(localStorage.getItem('isAccountSetup')) {
            navigate('/dashboard')
        }
        setStartLoading(false)
    }, 2000);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // User already has a profile, redirect to dashboard
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Error checking user profile:', err);
                setError('Error checking user profile');
            }
        };

        checkUserProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubjectChange = (subject) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter(s => s !== subject)
                : [...prev.subjects, subject]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.school || !formData.grade || !formData.country || formData.subjects.length === 0) {
            setError('Please fill in all fields and select at least one subject')
            return
        }

        try {
            setLoading(true)
            setError('')

            const user = auth.currentUser
            if (!user) {
                throw new Error('No user found')
            }

            // Create user profile in Firestore
            const userRef = doc(db, 'users', user.uid)
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                school: formData.school,
                grade: formData.grade,
                subjects: formData.subjects,
                country: formData.country,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })

            // Navigate to dashboard or home
            navigate('/dashboard')
        } catch (err) {
            console.error('Setup error:', err)
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
            localStorage.setItem('isAccountSetup', true)
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
                            <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                                Hey <span className='bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>{'Student'}</span>!
                            </h1>
                            <p className='text-lg text-gray-600'>
                                Let's set up your profile to personalize your learning experience.
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <Input 
                                type="text"
                                name="school"
                                placeholder="School Name"
                                icon={FiBook}
                                onChange={handleChange}
                                value={formData.school}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Grade/Year
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <FiAward size={20} />
                                    </span>
                                    <select
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        className="
                                            w-full pl-10 pr-4 py-3 rounded-lg
                                            border border-gray-200 focus:border-blue-500
                                            focus:ring-2 focus:ring-blue-200
                                            transition-all duration-200 outline-none
                                            text-gray-700 placeholder:text-gray-400
                                            appearance-none bg-white
                                        "
                                    >
                                        <option value="">Select Grade/Year</option>
                                        {GRADES.map(grade => (
                                            <option key={grade} value={grade}>
                                                {grade}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Your Subjects
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SUBJECTS.map(subject => (
                                        <button
                                            key={subject}
                                            type="button"
                                            onClick={() => handleSubjectChange(subject)}
                                            className={`
                                                px-4 py-2 rounded-lg text-sm font-medium
                                                transition-colors duration-200
                                                ${formData.subjects.includes(subject)
                                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }
                                            `}
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Country
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <FiMapPin size={20} />
                                    </span>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="
                                            w-full pl-10 pr-4 py-3 rounded-lg
                                            border border-gray-200 focus:border-blue-500
                                            focus:ring-2 focus:ring-blue-200
                                            transition-all duration-200 outline-none
                                            text-gray-700 placeholder:text-gray-400
                                            appearance-none bg-white
                                        "
                                    >
                                        <option value="">Select Country</option>
                                        {COUNTRIES.map(country => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-medium">
                                    {error}
                                </p>
                            )}

                            <div className='pt-4'>
                                <Button 
                                    type="submit"
                                    content={loading ? 'Setting up...' : 'Setup!'}
                                    disabled={loading}
                                />
                            </div>
                        </form>
                    </div>
                    
                    <div className='relative group hidden md:block'>
                        <div className='absolute -inset-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300'></div>
                        <div className='absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition-transform duration-300'></div>
                        <img
                            className='relative rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]'
                            src={images.asset3}
                            alt="Setup Student Profile"
                            width={600}
                            height={600}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupStudent