import React from 'react'

const Feedback = (props) => {
  return (
    <div className='flex flex-col justify-start text-gray-600'>
      <div>
        {props.date}
      </div>
      <div className='font-bold text-black'>" {props.comment} "</div>
      <div>Current employee - {props.current} </div>
      <div className='flex w-max '>
        <div className='flex justify-center items-center'>
          <div className='w-5 h-5 bg-[#ED9017] rounded-lg'></div>
          <div className='ml-5'>{props.first}</div>
        </div>

        <div className='flex justify-center items-center ml-20'>
          <div className='w-5 h-5 bg-[#ED9017] rounded-lg'></div>
          <div className='ml-5'>{props.second}</div>
        </div>
      </div>

      <div className='flex'>
          <div className='w-5 h-5 bg-[#ED9017] rounded-lg'></div>
          <div className='ml-5'>{props.third}</div>
        </div>
    </div>
  )
}

export default Feedback