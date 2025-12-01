import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex justify-between items-center py-4 px-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white border-b-[1px] border-[rgba(255,255,255,0.04)]'>
      <div className='flex items-center gap-4'>
        <img src="/logo_punjab.png" alt="Punjab Naukari Logo" className='h-16 w-auto object-contain' style={{ maxHeight: '72px', imageRendering: 'auto' }} />
        <div>
          <h2 className='m-0 text-[24px] font-bold leading-tight'>Punjab Ghar Ghar Rozgar</h2>
          <p className='my-1 text-sm text-gray-300'>Your Gateway to Punjab Employment</p>
          <p className='my-0 text-sm text-gray-300'>Connecting Talent with Opportunities</p>
        </div>
      </div>
      <div className='flex gap-6 font-bold text-sm'>
        <div className='hover:text-[#f28c28] cursor-pointer transition-colors'>HOME</div>
        <div className='hover:text-[#f28c28] cursor-pointer transition-colors'>ABOUT US</div>
        <div className='hover:text-[#f28c28] cursor-pointer transition-colors'>CONTACT US</div>
        <Link to='/analytics' className='bg-[#f28c28] text-black px-4 py-2 rounded-lg hover:opacity-95 transition-colors'>
          ADMIN LOGIN
        </Link>
      </div>
    </div>
  )
}

export default Navbar
