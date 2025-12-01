import React, { useEffect, useMemo, useState } from 'react'
import searchicon from '../../assets/searchicon.svg'
import JobDisplay from '../../components/JobDisplay'
import { fetchJobFilters, fetchJobs } from '../../api/jobs'

const SAVED_JOBS_KEY = 'pn_saved_jobs'
const DEFAULT_PAGINATION = { page: 1, total_pages: 1, total: 0, limit: 10 }

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [jobType, setJobType] = useState('')
  const [district, setDistrict] = useState('')
  const [experience, setExperience] = useState('')
  const [qualification, setQualification] = useState('')
  const [minSalary, setMinSalary] = useState('')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    job_types: [],
    qualifications: [],
    experience_levels: [],
    districts: []
  })
  const [savedJobIds, setSavedJobIds] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || '[]')
    return saved.map(job => job.id)
  })

  const limit = 10

  // Fetch filter metadata
  useEffect(() => {
    const controller = new AbortController()
    fetchJobFilters(controller.signal)
      .then(setFilters)
      .catch(() => {
        /* silent fail - filters are optional */
      })
    return () => controller.abort()
  }, [])

  // Fetch jobs when filters change
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    fetchJobs(
      {
        search: searchTerm || undefined,
        job_type: jobType || undefined,
        qualification: qualification || undefined,
        district: district || undefined,
        experience: experience || undefined,
        min_salary: minSalary ? Number(minSalary) : undefined,
        sort,
        page,
        limit
      },
      controller.signal
    )
      .then(response => {
        setJobs(response.data)
        setPagination(response.pagination)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load jobs')
          setJobs([])
          setPagination(DEFAULT_PAGINATION)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [searchTerm, jobType, qualification, district, experience, minSalary, sort, page])

  const handleSearch = (event) => {
    event.preventDefault()
    setSearchTerm(searchInput.trim())
    setPage(1)
  }

  const handleSaveJob = (job) => {
    const current = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || '[]')
    if (current.some(item => item.id === job.id)) {
      return false
    }
    const updated = [...current, job]
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated))
    setSavedJobIds(updated.map(item => item.id))
    return true
  }

  const savedJobsSet = useMemo(() => new Set(savedJobIds), [savedJobIds])

  const clearFilters = () => {
    setJobType('')
    setDistrict('')
    setExperience('')
    setQualification('')
    setMinSalary('')
    setSort('recent')
    setSearchInput('')
    setSearchTerm('')
    setPage(1)
  }

  const canGoPrev = page > 1
  const canGoNext = pagination?.total_pages ? page < pagination.total_pages : false

  return (
    <div className='p-8'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <form onSubmit={handleSearch} className='flex flex-col gap-4 md:flex-row'>
          <div className='bg-white shadow-lg rounded-xl flex-1 flex items-center px-6 py-4'>
            <input
              className='flex-1 py-2 px-4 text-gray-700 border-none outline-none'
              type='text'
              placeholder='Search jobs, companies, or keywords...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              type='submit'
              className='bg-gradient-to-r from-[#ED9017] to-[#FF6B35] text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300'
            >
              <img className='w-5 h-5' src={searchicon} alt='searchicon' />
            </button>
          </div>
        </form>

        <div className='bg-white rounded-xl shadow-lg p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Filter Jobs</h3>
            <button
              onClick={clearFilters}
              className='text-sm text-[#ED9017] font-semibold hover:underline'
            >
              Reset filters
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Job Type</label>
              <select
                value={jobType}
                onChange={(e) => { setJobType(e.target.value); setPage(1) }}
                className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
              >
                <option value=''>All job types</option>
                {filters.job_types.map(type => (
                  <option key={type.id} value={type.type_name}>
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Qualification</label>
              <select
                value={qualification}
                onChange={(e) => { setQualification(e.target.value); setPage(1) }}
                className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
              >
                <option value=''>All qualifications</option>
                {filters.qualifications.map(q => (
                  <option key={q.id} value={q.qualification_name}>
                    {q.qualification_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Experience Level</label>
              <select
                value={experience}
                onChange={(e) => { setExperience(e.target.value); setPage(1) }}
                className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
              >
                <option value=''>All experience levels</option>
                {filters.experience_levels.map(level => (
                  <option key={level.id} value={level.level_name}>
                    {level.level_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>District</label>
              <select
                value={district}
                onChange={(e) => { setDistrict(e.target.value); setPage(1) }}
                className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
              >
                <option value=''>All districts</option>
                {filters.districts.map(d => (
                  <option key={d.id} value={d.district_name}>
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Min Salary (₹)</label>
              <input
                type='number'
                min='0'
                value={minSalary}
                onChange={(e) => { setMinSalary(e.target.value); setPage(1) }}
                className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
                placeholder='e.g. 30000'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED9017] focus:border-transparent'
              >
                <option value='recent'>Most recent</option>
                <option value='deadline'>Upcoming deadline</option>
                <option value='salary_high'>Salary (High to Low)</option>
                <option value='salary_low'>Salary (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-xl shadow flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>Recommended Jobs</h2>
            <p className='text-gray-600'>
              {pagination.total} jobs found • Page {page} of {pagination.total_pages || 1}
            </p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => canGoPrev && setPage(page - 1)}
              disabled={!canGoPrev}
              className={`px-4 py-2 rounded-lg border ${
                canGoPrev ? 'border-[#ED9017] text-[#ED9017]' : 'border-gray-200 text-gray-300'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => canGoNext && setPage(page + 1)}
              disabled={!canGoNext}
              className={`px-4 py-2 rounded-lg border ${
                canGoNext ? 'border-[#ED9017] text-[#ED9017]' : 'border-gray-200 text-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {loading && (
          <div className='bg-white rounded-xl shadow p-8 text-center text-gray-600'>
            Fetching the latest jobs for you...
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-4'>
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className='bg-white rounded-xl shadow p-8 text-center text-gray-600'>
            No jobs matched your filters. Try adjusting your search.
          </div>
        )}

        <div className='space-y-4'>
          {jobs.map(job => (
            <JobDisplay
              key={job.id}
              job={job}
              onSave={() => handleSaveJob(job)}
              isSaved={savedJobsSet.has(job.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Jobs
