import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { fetchJobFilters, fetchJobs } from '../../api/jobs'

const HeroSection = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [jobTypes, setJobTypes] = useState([])
  const [qualifications, setQualifications] = useState([])
  const [experienceLevels, setExperienceLevels] = useState([])
  const [districts, setDistricts] = useState([])
  const [formData, setFormData] = useState({
    jobType: '',
    qualification: '',
    experience: '',
    district: '',
    jobTitle: ''
  })
  const [results, setResults] = useState([])
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  })
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' })
  const [authLoading, setAuthLoading] = useState(false)

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await fetchJobFilters()
        setJobTypes(options.job_types?.map(item => item.type_name) || [])
        setQualifications(options.qualifications?.map(item => item.qualification_name) || [])
        setExperienceLevels(options.experience_levels?.map(item => item.level_name) || [])
        setDistricts(options.districts?.map(item => item.district_name) || [])
      } catch (error) {
        console.error('Error fetching options:', error)
        // Fallback to known values if API fails
        setJobTypes(['Government', 'Private'])
        setQualifications(['12th Pass', 'Graduate', 'Post Graduate', 'Others'])
        setExperienceLevels(['0-2 years', '2-5 years', '5-10 years', '10+ years'])
      }
    }

    fetchOptions()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const submitRegister = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage({ type: '', text: '' })
    try {
      await axios.post(
        `${BASE_URL}/api/auth/register`,
        {
          full_name: registerForm.fullName.trim(),
          email: registerForm.email.trim(),
          phone: registerForm.phone.trim(),
          password: registerForm.password,
          role: 'user'
        },
        { withCredentials: true }
      )
      setAuthMessage({ type: 'success', text: 'Account created successfully! Redirecting...' })
      setRegisterForm({ fullName: '', email: '', phone: '', password: '' })
      setTimeout(() => navigate('/user'), 600)
    } catch (error) {
      const detail = error.response?.data?.detail || 'Unable to create account. Please try again.'
      setAuthMessage({ type: 'error', text: detail })
    } finally {
      setAuthLoading(false)
    }
  }

  const submitLogin = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthMessage({ type: '', text: '' })
    try {
      await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email: loginForm.email.trim(),
          password: loginForm.password
        },
        { withCredentials: true }
      )
      setAuthMessage({ type: 'success', text: 'Login successful! Redirecting...' })
      setLoginForm({ email: '', password: '' })
      setTimeout(() => navigate('/user'), 600)
    } catch (error) {
      const detail = error.response?.data?.detail || 'Invalid email or password.'
      setAuthMessage({ type: 'error', text: detail })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    setResultsLoading(true)
    setResultsError('')
    setHasSearched(true)
    try {
      const payload = {
        job_type: formData.jobType || undefined,
        qualification: formData.qualification || undefined,
        district: formData.district || undefined,
        experience: formData.experience || undefined,
        search: formData.jobTitle || undefined,
        limit: 6,
        page: 1
      }
      const response = await fetchJobs(payload)
      setResults(response.data || [])
    } catch (error) {
      console.error('Error searching jobs:', error)
      setResults([])
      setResultsError(error.message || 'Unable to fetch jobs. Please try again.')
    }
    setResultsLoading(false)
  }

  const showLogin = () => {
    setActiveTab('login')
  }

  const showRegister = () => {
    setActiveTab('register')
  }

  return (
    <div className='flex justify-between items-start gap-[70px] w-[90%] mx-auto my-[60px]'>
      {/* Search Box */}
      <div className='w-[750px] bg-[rgba(0,55,150,0.75)] p-[35px] rounded-[20px] text-white backdrop-blur-[6px] shadow-[0_0_20px_rgba(0,0,0,0.3)]'>
      <form onSubmit={handleSearch} className='form-light-inputs'>
          <h2 className='text-center mb-6 text-[28px] font-bold flex items-center justify-center gap-3'>
            <span className='text-4xl'>🔍</span>
            Fill out the form below to search Jobs
          </h2>

          <div className='flex gap-4 mb-5'>
            <select 
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className='w-full p-3 rounded-lg border-none text-sm text-gray-800'
            >
              <option value="">Select Job Type</option>
              {jobTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <select 
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              className='w-full p-3 rounded-lg border-none text-sm text-gray-800'
            >
              <option value="">Select Qualification</option>
              {qualifications.map((qual, index) => (
                <option key={index} value={qual}>{qual}</option>
              ))}
            </select>
          </div>

          <div className='flex gap-4 mb-5'>
            <select 
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className='w-full p-3 rounded-lg border-none text-sm text-gray-800'
            >
              <option value="">Experience (years)</option>
              {experienceLevels.map((exp, index) => (
                <option key={index} value={exp}>{exp}</option>
              ))}
            </select>
            <select 
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className='w-full p-3 rounded-lg border-none text-sm text-gray-800'
            >
              <option value="">Place of Posting</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <input 
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="Enter Job Title or Organization Name"
            className='w-full p-3 rounded-lg border-none text-sm mb-5 text-gray-800'
          />

          <button 
            type='submit'
            className='block mx-auto w-[180px] bg-[#f28c28] text-black border-none p-3 font-bold text-base rounded-lg cursor-pointer hover:bg-[#ff6a00] transition-colors'
          >
            {resultsLoading ? 'Searching...' : 'Search Jobs'}
          </button>
        </form>

        <div className='mt-6 space-y-3'>
          {resultsError && (
            <div className='bg-red-100 text-red-700 rounded-lg p-3 text-sm'>
              {resultsError}
            </div>
          )}

          {!resultsLoading && hasSearched && !resultsError && results.length === 0 && (
            <div className='bg-white/20 text-white px-4 py-3 rounded-lg text-center text-sm font-semibold'>
              No jobs found for the selected criteria.
            </div>
          )}

          {results.length > 0 && (
            <div className='bg-white/10 rounded-xl p-4 space-y-3 max-h-[320px] overflow-y-auto'>
              {results.map(job => (
                <div key={job.id} className='bg-white text-gray-800 rounded-lg p-3 shadow'>
                  <div className='font-semibold text-lg text-[#003796]'>{job.job_title}</div>
                  <div className='text-sm text-gray-600'>{job.organization_name}</div>
                  <div className='text-sm text-gray-600'>
                    {job.taluk_name ? `${job.taluk_name}, ` : ''}{job.district_name}
                  </div>
                  <div className='text-xs text-gray-500 mt-2'>
                    <span className='font-semibold text-gray-700'>Qualification:</span> {job.qualification || 'Not specified'}
                    <span className='mx-2'>•</span>
                    <span className='font-semibold text-gray-700'>Experience:</span> {job.experience_level || 'Not specified'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex gap-5 mt-5 justify-center'>
          <div className='w-[45%] bg-[#0057b8] text-white p-4 rounded-xl text-center'>
            <div className='text-xl font-bold'>10,234</div>
            <small className='text-xs opacity-90'>Available Govt. Jobs</small>
          </div>
          <div className='w-[45%] bg-[#0057b8] text-white p-4 rounded-xl text-center'>
            <div className='text-xl font-bold'>15,234</div>
            <small className='text-xs opacity-90'>Private Sector Jobs</small>
        </div>
        </div>
        </div>

      {/* Login / Register Panel */}
      <div className='w-[380px] bg-[#0d0d0d] p-8 rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white mt-6 ml-auto'>
        {/* Tab Switcher */}
        <div className='flex bg-[#1a1a1a] rounded-lg mb-5'>
          <div 
            className={`w-1/2 text-center p-3 font-bold cursor-pointer rounded-lg ${activeTab === 'login' ? 'bg-[#ff6a00] text-white' : 'text-white'}`}
            onClick={showLogin}
          >
            Login
        </div>
          <div 
            className={`w-1/2 text-center p-3 font-bold cursor-pointer rounded-lg ${activeTab === 'register' ? 'bg-[#ff6a00] text-white' : 'text-white'}`}
            onClick={showRegister}
          >
            Register
    </div>
</div>

        {/* Login Tab */}
        <div className='space-y-4'>
          {authMessage.text && (
            <div className={`text-sm text-center px-3 py-2 rounded-lg ${authMessage.type === 'error' ? 'bg-red-600/30 text-red-200' : 'bg-green-600/30 text-green-100'}`}>
              {authMessage.text}
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={submitLogin}>
              <input 
                className='w-full p-3 rounded-lg border border-[#333] bg-[#1a1a1a] text-white mb-4 text-sm'
                type="email" 
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Email"
                required
              />
              <input 
                className='w-full p-3 rounded-lg border border-[#333] bg-[#1a1a1a] text-white mb-4 text-sm'
                type="password" 
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Enter password"
                required
              />
              <div className='text-center text-xs text-[#ccc] mb-3 cursor-pointer hover:text-[#f28c28]'>
                Forgot password | Login using OTP
              </div>
              <button
                type='submit'
                disabled={authLoading}
                className='w-full bg-[#ff6a00] p-3 rounded-lg border-none text-white font-bold mt-2.5 text-base cursor-pointer hover:bg-[#ff8533] transition-colors disabled:opacity-70'
              >
                {authLoading ? 'Processing...' : 'Login'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={submitRegister}>
              <input 
                className='w-full p-3 rounded-lg border border-[#333] bg-[#1a1a1a] text-white mb-4 text-sm'
                type="text" 
                name="fullName"
                value={registerForm.fullName}
                onChange={handleRegisterChange}
                placeholder="Full Name"
                required
              />
              <input 
                className='w-full p-3 rounded-lg border border-[#333] bg-[#1a1a1a] text-white mb-4 text-sm'
                type="email" 
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="Email"
                required
              />
              <input 
                className='w-full p-3 rounded-lg border border-[#333] bg-[#1a1a1a] text-white mb-4 text-sm'
                type="text" 
                name="phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                placeholder="Mobile Number"
                required
              />
              <input 
                className='w-full p-3 rounded-lg border border-[#333] bg-[#1a1a1a] text-white mb-4 text-sm'
                type="password" 
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Create Password (min 8 chars)"
                required
              />
              <button
                type='submit'
                disabled={authLoading}
                className='w-full bg-[#ff6a00] p-3 rounded-lg border-none text-white font-bold mt-2.5 text-base cursor-pointer hover:bg-[#ff8533] transition-colors disabled:opacity-70'
              >
                {authLoading ? 'Processing...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
</div>
    </div>
  )
}

export default HeroSection
