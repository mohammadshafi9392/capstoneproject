import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import JobDisplay from '../../components/JobDisplay'

const SAVED_JOBS_KEY = 'pn_saved_jobs'

const MyJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || '[]')
    setSavedJobs(stored)
  }, [])

  const handleRemove = (jobId) => {
    const updated = savedJobs.filter(job => job.id !== jobId)
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated))
    setSavedJobs(updated)
  }

  return (
    <div className='space-y-4 p-6'>
      <div className='bg-white p-5 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Saved Jobs</h2>
          <p className='text-gray-600 text-sm'>Keep track of opportunities you want to revisit later.</p>
        </div>
        <Link
          to='/user'
          className='text-[#ED9017] font-semibold text-sm hover:underline'
        >
          Browse more jobs
        </Link>
      </div>

      {savedJobs.length === 0 ? (
        <div className='bg-white rounded-xl shadow p-8 text-center text-gray-600'>
          No saved jobs yet. Save jobs from the Jobs tab to see them here.
        </div>
      ) : (
        <div className='space-y-4'>
          {savedJobs.map(job => (
            <JobDisplay
              key={job.id}
              job={job}
              onRemove={() => handleRemove(job.id)}
              isSaved
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyJobs
