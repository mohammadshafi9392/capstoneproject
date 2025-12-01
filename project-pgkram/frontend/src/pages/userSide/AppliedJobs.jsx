import React, { useEffect, useState } from 'react'
import { fetchApplications } from '../../api/jobs'
import { Link } from 'react-router-dom'

const PROFILE_KEY = 'pn_job_user_profile'

const AppliedJobs = () => {
  const storedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')

  const [email, setEmail] = useState(storedProfile.email || '')
  const [phone, setPhone] = useState(storedProfile.phone || '')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const nextProfile = {
      ...storedProfile,
      email,
      phone
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile))
  }, [email, phone])

  useEffect(() => {
    if (!email && !phone) {
      setApplications([])
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')

    fetchApplications({ email: email || undefined, phone: phone || undefined }, controller.signal)
      .then(response => {
        setApplications(response.data)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to fetch applications')
          setApplications([])
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [email, phone, refreshKey])

  const handleRefresh = () => setRefreshKey(prev => prev + 1)

  return (
    <div className='p-8 space-y-6'>
      <div className='bg-white p-6 rounded-xl shadow space-y-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Applied Jobs</h1>
          <p className='text-gray-600 text-sm'>
            Enter the email or phone number you used while applying to sync your applications from the Punjab Ghar Ghar Rozgar backend.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              placeholder='applicant@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
            <input
              type='tel'
              placeholder='Optional'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
            />
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={handleRefresh}
            className='bg-[#ED9017] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d1790d] transition-colors'
          >
            Sync applications
          </button>
          <span className='text-sm text-gray-500'>
            {applications.length} application(s) found
          </span>
        </div>
      </div>

      {loading && (
        <div className='bg-white rounded-xl shadow p-8 text-center text-gray-600'>
          Fetching your application history...
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-4'>
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className='bg-white rounded-xl shadow p-8 text-center text-gray-600'>
          No applications found. Apply to a job or update your email/phone and try syncing again.
        </div>
      )}

      <div className='space-y-4'>
        {applications.map((application) => {
          const appliedOn = application.created_at ? new Date(application.created_at).toLocaleDateString('en-IN') : 'N/A'
          const deadline = application.application_deadline ? new Date(application.application_deadline).toLocaleDateString('en-IN') : 'Rolling'
          return (
            <div key={application.id} className='bg-white rounded-xl shadow p-5 flex flex-col gap-3 md:flex-row md:justify-between md:items-center'>
              <div>
                <div className='text-sm text-gray-500 uppercase tracking-wide'>{application.job_type}</div>
                <div className='text-lg font-semibold text-gray-900'>{application.job_title}</div>
                <div className='text-sm text-gray-600'>{application.organization_name}</div>
                <div className='mt-2 text-sm text-gray-500'>
                  Applied on <span className='font-medium text-gray-700'>{appliedOn}</span> • Deadline <span className='font-medium text-gray-700'>{deadline}</span>
                </div>
              </div>
              <div className='flex flex-row gap-3 md:flex-col md:min-w-[200px]'>
                <span className='inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold capitalize'>
                  {application.status}
                </span>
                <Link
                  to={`/apply/${application.job_id}`}
                  target='_blank'
                  className='text-[#ED9017] font-semibold text-sm hover:underline text-center'
                >
                  View job details
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AppliedJobs
