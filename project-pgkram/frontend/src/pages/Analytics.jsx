import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchJobStats, fetchTrends, fetchTopDistricts, fetchSalaryDistribution, fetchTopOrganizations } from '../api/analytics'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import { FaUniversity, FaBriefcase, FaMapMarkedAlt, FaBuilding } from 'react-icons/fa'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState([])
  const [districts, setDistricts] = useState([])
  const [salaries, setSalaries] = useState([])
  const [orgs, setOrgs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abort = new AbortController()
    
    const loadAnalytics = async () => {
      try {
        const [statsRes, trendRes, districtsRes, salariesRes, orgsRes] = await Promise.all([
          fetchJobStats(abort.signal).catch(err => {
            if (err.name === 'AbortError') return null;
            throw err;
          }),
          fetchTrends(6, abort.signal).catch(err => {
            if (err.name === 'AbortError') return null;
            throw err;
          }),
          fetchTopDistricts(5, abort.signal).catch(err => {
            if (err.name === 'AbortError') return null;
            throw err;
          }),
          fetchSalaryDistribution(abort.signal).catch(err => {
            if (err.name === 'AbortError') return null;
            throw err;
          }),
          fetchTopOrganizations(5, abort.signal).catch(err => {
            if (err.name === 'AbortError') return null;
            throw err;
          }),
        ]);

        // Only update state if not aborted
        if (!abort.signal.aborted) {
          if (statsRes) setStats(statsRes?.data || {});
          if (trendRes) setTrend(trendRes?.data || []);
          if (districtsRes) setDistricts(districtsRes?.data || []);
          if (salariesRes) setSalaries(salariesRes?.data || []);
          if (orgsRes) setOrgs(orgsRes?.data || []);
        }
      } catch (error) {
        // Only set error if not aborted
        if (!abort.signal.aborted) {
          setError(error.message || 'Failed to load analytics');
        }
      } finally {
        // Only set loading to false if not aborted
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();
    
    return () => {
      abort.abort();
    };
  }, [])

  // Derived analytics insights
  const insights = useMemo(() => {
    const totalJobs = trend.reduce((sum, t) => sum + (t?.jobs || 0), 0)
    const last = trend[trend.length - 1]?.jobs || 0
    const prev = trend[trend.length - 2]?.jobs || 0
    const growthPct = prev > 0 ? (((last - prev) / prev) * 100).toFixed(1) : '0.0'
    
    // Get month names for better display
    const lastMonth = trend[trend.length - 1]?.month || 'Current'
    const prevMonth = trend[trend.length - 2]?.month || 'Previous'

    const topBucket = salaries
      .slice()
      .sort((a, b) => (b?.jobs || 0) - (a?.jobs || 0))[0]

    return {
      totalJobs,
      lastMonthJobs: last,
      growthPct,
      lastMonth,
      prevMonth,
      topSalaryBucket: topBucket?.bucket || '-',
      topSalaryJobs: topBucket?.jobs || 0,
    }
  }, [trend, salaries])

  const trendData = useMemo(() => ({
    labels: trend.map((t) => t.month),
    datasets: [
      {
        label: 'Jobs Posted',
        data: trend.map((t) => t.jobs),
        backgroundColor: 'rgba(99, 102, 241, 0.75)',
        hoverBackgroundColor: 'rgba(79, 70, 229, 0.95)',
        borderRadius: 8,
      },
    ],
  }), [trend])

  const trendOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#eef2ff' }, ticks: { stepSize: 10 } },
    },
    layout: { padding: { top: 8, right: 8, bottom: 0, left: 0 } },
  }), [])

  const salaryData = useMemo(() => ({
    labels: salaries.map((s) => s.bucket),
    datasets: [
      {
        data: salaries.map((s) => s.jobs),
        backgroundColor: ['#a78bfa', '#60a5fa', '#34d399', '#f59e0b', '#f87171', '#38bdf8'],
        hoverOffset: 8,
      },
    ],
  }), [salaries])

  const salaryOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10 } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} jobs` } },
    },
    layout: { padding: { top: 6, bottom: 6 } },
  }), [])

  const districtsData = useMemo(() => ({
    labels: districts.map((d) => d.district),
    datasets: [
      {
        label: 'Jobs',
        data: districts.map((d) => d.jobs),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  }), [districts])

  const orgsData = useMemo(() => ({
    labels: orgs.map((o) => o.organization),
    datasets: [
      {
        label: 'Jobs',
        data: orgs.map((o) => o.jobs),
        backgroundColor: '#f59e0b',
        borderRadius: 6,
      },
    ],
  }), [orgs])

  return (
    <div className='h-screen bg-slate-50'>
      <Navbar />
      <div className='p-10'>
        <div>
          <h1 className='font-medium '>Analytic Dashboard</h1>
          <h1 className='font-medium text-gray-400 text-sm'>Control and analyse your data in the most convenient way</h1>
        </div>
        
        {/* Live Stats */}
        <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='p-5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg'>
            <div className='flex items-center gap-2 text-xs opacity-90'><FaUniversity/> Government Jobs</div>
            <div className='text-3xl font-bold mt-1'>{stats?.gov_jobs ?? '-'}</div>
          </div>
          <div className='p-5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg'>
            <div className='flex items-center gap-2 text-xs opacity-90'><FaBriefcase/> Private Jobs</div>
            <div className='text-3xl font-bold mt-1'>{stats?.private_jobs ?? '-'}</div>
          </div>
          <div className='p-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'>
            <div className='flex items-center gap-2 text-xs opacity-90'><FaMapMarkedAlt/> Districts</div>
            <div className='text-3xl font-bold mt-1'>{stats?.total_districts ?? '-'}</div>
          </div>
          <div className='p-5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'>
            <div className='flex items-center gap-2 text-xs opacity-90'><FaBuilding/> Employers</div>
            <div className='text-3xl font-bold mt-1'>{stats?.total_employers ?? '-'}</div>
          </div>
        </div>

        {loading && (
          <div className='mt-3 text-sm text-gray-600'>Loading analytics…</div>
        )}
        {error && (
          <div className='mt-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        {/* Dynamic charts */}
        <div className='grid md:grid-cols-3 gap-5 mt-6'>
          <div className='bg-white p-4 rounded-xl border border-indigo-200 shadow-sm md:col-span-2'>
            <div className='flex items-center justify-between mb-2'>
              <div className='font-semibold'>Current vs Previous Month</div>
              <div className='text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full'>
                {insights.lastMonth}: {insights.lastMonthJobs} jobs • {insights.growthPct}% vs {insights.prevMonth}
              </div>
            </div>
            <div className='h-56'>
              <Bar data={trendData} options={trendOptions} />
            </div>
          </div>

          <div className='bg-white p-4 rounded-xl border border-indigo-200 shadow-sm'>
            <div className='font-semibold mb-2'>Salary Distribution</div>
            <div className='h-56'>
              <Doughnut data={salaryData} options={salaryOptions} />
            </div>
            <div className='mt-2 text-xs text-gray-600 flex items-center justify-between'>
              <span>Top bucket</span>
              <span className='font-semibold text-gray-800'>{insights.topSalaryBucket}</span>
            </div>
          </div>
        </div>

        {/* Compact insights */}
        <div className='grid sm:grid-cols-3 gap-4 mt-5'>
          <div className='bg-white p-4 rounded-xl border border-emerald-200 shadow-sm'>
            <div className='text-xs text-emerald-700'>Total jobs in range</div>
            <div className='text-2xl font-bold text-emerald-700'>{insights.totalJobs}</div>
          </div>
          <div className='bg-white p-4 rounded-xl border border-blue-200 shadow-sm'>
            <div className='text-xs text-blue-700'>{insights.lastMonth} vs {insights.prevMonth}</div>
            <div className='text-2xl font-bold text-blue-700'>{insights.growthPct}%</div>
          </div>
          <div className='bg-white p-4 rounded-xl border border-amber-200 shadow-sm'>
            <div className='text-xs text-amber-700'>Top salary bucket jobs</div>
            <div className='text-2xl font-bold text-amber-700'>{insights.topSalaryJobs}</div>
          </div>
        </div>

        {/* Additional Analytics Panels */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6'>
          {/* Job Type Distribution */}
          <div className='bg-white p-4 rounded-xl border border-cyan-200 shadow-sm'>
            <div className='font-semibold mb-3 text-cyan-800'>Job Type Distribution</div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Government</span>
                <div className='flex items-center space-x-2'>
                  <div className='w-16 bg-gray-200 rounded-full h-2'>
                    <div className='bg-cyan-500 h-2 rounded-full' style={{width: `${(stats?.gov_jobs || 0) / ((stats?.gov_jobs || 0) + (stats?.private_jobs || 0)) * 100}%`}}></div>
                  </div>
                  <span className='text-sm font-semibold text-cyan-700'>{stats?.gov_jobs || 0}</span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Private</span>
                <div className='flex items-center space-x-2'>
                  <div className='w-16 bg-gray-200 rounded-full h-2'>
                    <div className='bg-cyan-300 h-2 rounded-full' style={{width: `${(stats?.private_jobs || 0) / ((stats?.gov_jobs || 0) + (stats?.private_jobs || 0)) * 100}%`}}></div>
                  </div>
                  <span className='text-sm font-semibold text-cyan-700'>{stats?.private_jobs || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Coverage */}
          <div className='bg-white p-4 rounded-xl border border-green-200 shadow-sm'>
            <div className='font-semibold mb-3 text-green-800'>Geographic Coverage</div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Districts Covered</span>
                <span className='text-lg font-bold text-green-700'>{stats?.total_districts || 0}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Active Employers</span>
                <span className='text-lg font-bold text-green-700'>{stats?.total_employers || 0}</span>
              </div>
              <div className='mt-3 p-2 bg-green-50 rounded-lg'>
                <div className='text-xs text-green-700'>Coverage Rate</div>
                <div className='text-sm font-semibold text-green-800'>
                  {(() => {
                    const totalDistricts = stats?.total_districts || 0;
                    const punjabDistricts = 22; // Punjab has 22 districts
                    const coverage = Math.min((totalDistricts / punjabDistricts) * 100, 100);
                    return `${coverage.toFixed(1)}% of Punjab`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Market Activity */}
          <div className='bg-white p-4 rounded-xl border border-purple-200 shadow-sm'>
            <div className='font-semibold mb-3 text-purple-800'>Market Activity</div>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Avg Jobs/Month</span>
                <span className='text-lg font-bold text-purple-700'>{Math.round(insights.totalJobs / 6)}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Growth Trend</span>
                <span className={`text-sm font-semibold ${parseFloat(insights.growthPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(insights.growthPct) >= 0 ? '↗' : '↘'} {insights.growthPct}%
                </span>
              </div>
              <div className='mt-3 p-2 bg-purple-50 rounded-lg'>
                <div className='text-xs text-purple-700'>Market Health</div>
                <div className='text-sm font-semibold text-purple-800'>
                  {parseFloat(insights.growthPct) >= 5 ? 'Excellent' : parseFloat(insights.growthPct) >= 0 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className='grid md:grid-cols-2 gap-5 mt-6'>
          {/* Top Performing Districts */}
          <div className='bg-white p-4 rounded-xl border border-orange-200 shadow-sm'>
            <div className='font-semibold mb-3 text-orange-800'>Top Performing Districts</div>
            <div className='space-y-2'>
              {districts.slice(0, 3).map((district, index) => (
                <div key={district.district} className='flex justify-between items-center p-2 bg-orange-50 rounded-lg'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-bold text-orange-700'>#{index + 1}</span>
                    <span className='text-sm text-gray-700'>{district.district}</span>
                  </div>
                  <span className='text-sm font-semibold text-orange-700'>{district.jobs} jobs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hiring Organizations */}
          <div className='bg-white p-4 rounded-xl border border-indigo-200 shadow-sm'>
            <div className='font-semibold mb-3 text-indigo-800'>Top Hiring Organizations</div>
            <div className='space-y-2'>
              {orgs.slice(0, 3).map((org, index) => (
                <div key={org.organization} className='flex justify-between items-center p-2 bg-indigo-50 rounded-lg'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-bold text-indigo-700'>#{index + 1}</span>
                    <span className='text-sm text-gray-700 truncate'>{org.organization}</span>
                  </div>
                  <span className='text-sm font-semibold text-indigo-700'>{org.jobs} jobs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-5 mt-6'>
          <div className='bg-white p-4 rounded-xl border border-purple-200 shadow-sm'>
            <div className='font-semibold mb-2'>Top Districts</div>
            <div className='h-56'>
              <Bar data={districtsData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#f3e8ff' } }, y: { grid: { display: false } } } }} />
            </div>
          </div>
          <div className='bg-white p-4 rounded-xl border border-purple-200 shadow-sm'>
            <div className='font-semibold mb-2'>Top Organizations</div>
            <div className='h-56'>
              <Bar data={orgsData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#f3e8ff' } }, y: { grid: { display: false } } } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics