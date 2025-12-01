import React from 'react'
import { FaBell, FaBullhorn, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa'

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'job',
      title: 'New Job Alert',
      message: '5 new government jobs matching your profile',
      time: '2 hours ago',
      icon: FaBell,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'announcement',
      title: 'Important Notice',
      message: 'Skill development program registration opens tomorrow',
      time: '4 hours ago',
      icon: FaBullhorn,
      color: 'bg-green-500'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Application Deadline',
      message: 'Punjab Police recruitment closes in 3 days',
      time: '1 day ago',
      icon: FaCalendarAlt,
      color: 'bg-red-500'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Profile Update Required',
      message: 'Please update your skills section',
      time: '2 days ago',
      icon: FaExclamationTriangle,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6'>
      <div className='flex items-center mb-6'>
        <FaBell className='text-[#ED9017] text-2xl mr-3' />
        <h2 className='text-xl font-bold text-gray-800'>Notifications</h2>
      </div>
      
      <div className='space-y-4'>
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          // compute a text-color class from the bg- color (bg-blue-500 -> text-blue-500)
          const iconTextColor = notification.color.replace('bg-', 'text-')
          return (
            <div key={notification.id} className='flex items-start p-4 bg-white border border-gray-100 rounded-lg transition-colors duration-200'>
              <div className={'p-2 rounded-lg mr-4 flex-shrink-0 bg-white/5 ring-1 ring-white/10'}>
                <IconComponent className={`${iconTextColor} w-4 h-4`} />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-800 mb-1'>{notification.title}</h3>
                <p className='text-gray-600 text-sm mb-2'>{notification.message}</p>
                <span className='text-xs text-gray-500'>{notification.time}</span>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className='mt-6 text-center'>
        <button className='text-[#ED9017] hover:text-[#FF6B35] font-semibold transition-colors duration-200'>
          View All Notifications
        </button>
      </div>
    </div>
  )
}

export default Notifications