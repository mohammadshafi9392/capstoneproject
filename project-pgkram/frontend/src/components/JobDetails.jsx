import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from './Navbar'
import { applyToJob, fetchJobDetail } from '../api/jobs'

const PROFILE_KEY = 'pn_job_user_profile'

const JobDetails = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const storedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
  const [formData, setFormData] = useState({
    applicant_name: storedProfile.applicant_name || '',
    email: storedProfile.email || '',
    phone: storedProfile.phone || '',
    resume_url: storedProfile.resume_url || '',
    cover_letter: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetchJobDetail(id, controller.signal)
      .then(response => {
        setJob(response.data)
        setError('')
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load job details')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  const handleApplyClick = () => {
    setIsPopupOpen(true)
  }

  const handlePopupClose = () => {
    setIsPopupOpen(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.applicant_name || !formData.email) {
      toast.error('Name and email are required', { position: 'bottom-right' })
      return
    }
    try {
      setSubmitting(true)
      await applyToJob(id, formData)
      toast.success('Application submitted successfully!', { position: 'bottom-right' })
      setIsApplied(true)
      setIsPopupOpen(false)
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        applicant_name: formData.applicant_name,
        email: formData.email,
        phone: formData.phone,
        resume_url: formData.resume_url
      }))
    } catch (err) {
      toast.error(err.message || 'Failed to submit application', { position: 'bottom-right' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return null
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  const salaryText = job?.salary_min || job?.salary_max
    ? `${formatCurrency(job.salary_min) || ''} - ${formatCurrency(job.salary_max) || ''}`
    : 'Salary not disclosed'

  const deadline = job?.application_deadline ? new Date(job.application_deadline).toLocaleDateString('en-IN') : 'Rolling'
  const posted = job?.job_posted_date ? new Date(job.job_posted_date).toLocaleDateString('en-IN') : 'N/A'

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-5xl mx-auto py-10 px-4 space-y-6'>
        {loading && (
          <div className='bg-white rounded-xl shadow p-8 text-center text-gray-600'>
            Loading job details...
          </div>
        )}

        {error && !loading && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-4'>
            {error}
          </div>
        )}

        {!loading && !error && job && (
          <>
            <div className='bg-white rounded-xl shadow p-6 space-y-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-sm text-gray-500 uppercase tracking-wide'>{job.job_type}</span>
                <h1 className='text-3xl font-bold text-gray-900'>{job.job_title}</h1>
                <p className='text-lg text-gray-700'>{job.organization_name}</p>
                <p className='text-sm text-gray-500'>
                  {job.taluk_name && `${job.taluk_name}, `}{job.district_name} • Posted on {posted}
                </p>
              </div>
              <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                <span><strong>Experience:</strong> {job.experience_level}</span>
                <span><strong>Qualification:</strong> {job.qualification}</span>
                <span><strong>Salary:</strong> {salaryText}</span>
                <span><strong>Deadline:</strong> {deadline}</span>
                <span><strong>Vacancies:</strong> {job.total_vacancies || 'Not disclosed'}</span>
              </div>
              <div>
                <button
                  onClick={handleApplyClick}
                  disabled={isApplied}
                  className={`rounded-lg px-6 py-2 font-semibold text-white ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ED9017] hover:bg-[#d1790d]'}`}
                >
                  {isApplied ? 'Application submitted' : 'Apply now'}
                </button>
              </div>
            </div>

            {job.job_description && (
              <div className='bg-white rounded-xl shadow p-6 space-y-2'>
                <h2 className='text-xl font-semibold text-gray-900'>About the job</h2>
                <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {job.job_description}
                </p>
              </div>
            )}

            {job.requirements && (
              <div className='bg-white rounded-xl shadow p-6 space-y-2'>
                <h2 className='text-xl font-semibold text-gray-900'>Requirements</h2>
                <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {job.requirements}
                </p>
              </div>
            )}

            {job.benefits && (
              <div className='bg-white rounded-xl shadow p-6 space-y-2'>
                <h2 className='text-xl font-semibold text-gray-900'>Benefits</h2>
                <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {job.benefits}
                </p>
              </div>
            )}

            {job.contact_details && (
              <div className='bg-white rounded-xl shadow p-6 space-y-2'>
                <h2 className='text-xl font-semibold text-gray-900'>Contact details</h2>
                <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {job.contact_details}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {isPopupOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white w-full max-w-xl rounded-xl p-6 space-y-4 shadow-xl'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-gray-800'>Apply for {job?.job_title}</h3>
              <button onClick={handlePopupClose} className='text-gray-500 hover:text-gray-700'>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full name</label>
                <input
                  name='applicant_name'
                  value={formData.applicant_name}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
                  required
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Phone (optional)</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Resume / portfolio link</label>
                <input
                  type='url'
                  name='resume_url'
                  value={formData.resume_url}
                  onChange={handleChange}
                  placeholder='https://'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Cover letter (optional)</label>
                <textarea
                  name='cover_letter'
                  value={formData.cover_letter}
                  onChange={handleChange}
                  rows='4'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
                  placeholder='Tell the employer why you are a good fit...'
                />
              </div>
              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={handlePopupClose}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='px-4 py-2 rounded-lg bg-[#ED9017] text-white font-semibold hover:bg-[#d1790d] disabled:bg-gray-400'
                >
                  {submitting ? 'Submitting...' : 'Submit application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetails
