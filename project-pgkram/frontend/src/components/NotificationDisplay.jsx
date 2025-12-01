// NotificationDisplay.jsx
import React from 'react';

const NotificationDisplay = ({ notification, onDelete }) => {
  return (
    <div className='m-4 p-4 bg-gray-200 rounded-lg'>
      {/* 1st row */}
      <div className='flex'>
        <div>{notification.icon}</div>
        <div className='ml-2'>
          <div className='font-bold'>{notification.notihead}</div>
          <div className='text-[14px]'>{notification.notivalue}</div>
        </div>
      </div>

      {/* 2nd row */}
      <div className='text-[14px] flex justify-between items-center mt-2'>
        <div className='text-gray-400'>{notification.notitime}</div>
        <button className='text-[#ED9017]' onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationDisplay;
