import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import saveicon from '../assets/saveicon.svg'
import shareicon from '../assets/shareicon.svg'
import { Link } from 'react-router-dom'

const formatCurrency = (value) => {
  if (value === null || value === undefined) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)
}

const JobDisplay = ({ job, onSave, onRemove, isSaved = false }) => {
  const [saved, setSaved] = useState(isSaved)

  useEffect(() => {
    setSaved(isSaved)
  }, [isSaved])

  if (!job) {
    return null
  }

  const location = [job.taluk_name, job.district_name].filter(Boolean).join(', ') || 'Punjab'
  const salaryText = job.salary_min || job.salary_max
    ? `${formatCurrency(job.salary_min) || ''} - ${formatCurrency(job.salary_max) || ''}`
    : 'Salary not disclosed'
  const deadline = job.application_deadline ? new Date(job.application_deadline).toLocaleDateString('en-IN') : 'Rolling'
  const posted = job.job_posted_date ? new Date(job.job_posted_date).toLocaleDateString('en-IN') : 'N/A'
  const description = job.job_description
    ? `${job.job_description.split(/\s+/).slice(0, 30).join(' ')}${job.job_description.split(/\s+/).length > 30 ? '...' : ''}`
    : 'Description not available.'

  const handleSave = () => {
    if (saved) {
      toast.info('Job already saved', { position: 'bottom-right' })
      return
    }
    if (onSave) {
      const result = onSave(job)
      if (result !== false) {
        setSaved(true)
        toast.success('Job saved!', { position: 'bottom-right' })
      }
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(job.id)
      toast.success('Similar jobs will be hidden', { position: 'bottom-right' })
    }
  }

  return (
    <div className='bg-white p-5 rounded-xl shadow flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex-1'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
          <div>
            <div className='font-semibold text-lg text-gray-900'>{job.job_title}</div>
            <div className='text-sm text-gray-600'>{job.organization_name}</div>
            <div className='text-xs text-gray-500'>{location}</div>
          </div>
          <div className='text-right text-sm text-gray-500'>
            Posted: <span className='font-medium text-gray-700'>{posted}</span>
          </div>
        </div>

        <div className='my-3 text-sm text-gray-700 leading-relaxed'>
          {description}
        </div>

        <div className='flex flex-wrap gap-2 text-xs'>
          {job.job_type && (
            <span className='bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold'>
              {job.job_type}
            </span>
          )}
          {job.experience_level && (
            <span className='bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-semibold'>
              {job.experience_level}
            </span>
          )}
          {job.qualification && (
            <span className='bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-semibold'>
              {job.qualification}
            </span>
          )}
        </div>

        <div className='mt-3 text-sm text-gray-600 flex flex-wrap gap-4'>
          <span className='font-semibold text-gray-900'>Salary:</span> {salaryText}
          <span className='font-semibold text-gray-900'>Deadline:</span> {deadline}
          <span className='font-semibold text-gray-900'>Vacancies:</span> {job.total_vacancies || 'Not specified'}
        </div>
      </div>

      <div className='flex flex-row gap-3 md:flex-col'>
        <Link to={`/apply/${job.id}`} target='_blank'>
          <button className='bg-[#4f2ce0] text-white px-5 py-2 rounded-lg hover:bg-[#3f24b8] transition-colors w-full'>
            Apply
          </button>
        </Link>
        {onRemove && (
          <button
            onClick={handleRemove}
            className='bg-gray-100 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full'
          >
            Don&apos;t recommend
          </button>
        )}
      </div>

      <div className='flex flex-row gap-3 md:flex-col'>
        <button onClick={handleSave} className='p-2 rounded-lg bg-[#ED9017] hover:bg-[#d1790d] transition-colors'>
          <img className='w-6 h-6' src={saveicon} alt='save job' />
        </button>
        <button className='p-2 rounded-lg bg-[#ED9017] hover:bg-[#d1790d] transition-colors'>
          <img className='w-6 h-6' src={shareicon} alt='share job' />
        </button>
      </div>
    </div>
  )
}

export default JobDisplay
