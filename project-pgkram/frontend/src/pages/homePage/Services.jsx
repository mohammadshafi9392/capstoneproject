import React from 'react'
import { FaBriefcase, FaGraduationCap, FaUserTie, FaHandsHelping, FaFemale, FaChartLine, FaWheelchair, FaComments } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className='py-16'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-100 mb-4'>Our Services</h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Comprehensive employment solutions for the people of Punjab
            </p>
          </div>

            {/* 1st row */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
                <Link to='/user' className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)] block'>
                    <div className='bg-gradient-to-br from-violet-700 to-violet-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaBriefcase/>
                    </div>
                    <h3 className='font-bold text-xl mb-2 text-gray-100'>Jobs</h3>
                    <p className='text-gray-300 text-sm mb-4'>Find government and private sector employment opportunities</p>
                    <div className='w-full h-1 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full'></div>
                </Link>

                <div className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                <Link to='https://www.pgrkam.com/aboutus' className='block'>
                    <div className='bg-gradient-to-br from-blue-700 to-blue-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaGraduationCap/>
                    </div>
                    <h3 className='font-bold text-xl mb-2 text-gray-100'>Skill Training</h3>
                    <p className='text-gray-300 text-sm mb-4'>Enhance your skills with professional training programs</p>
                    <div className='w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full'></div>
                </Link>
                </div>

                <div className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                <Link to='https://www.pgrkam.com/self-employment' className='block'>
                    <div className='bg-gradient-to-br from-yellow-600 to-yellow-800 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaUserTie/>
                    </div>
                    <h3 className='font-bold text-xl mb-2 text-gray-100'>Self Employment</h3>
                    <p className='text-gray-300 text-sm mb-4'>Start your own business with our support programs</p>
                    <div className='w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full'></div>
                </Link>
                </div>

                <div className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                <Link to='https://www.pgrkam.com/local-services' className='block'>
                  <div className='bg-gradient-to-br from-green-700 to-green-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaHandsHelping/>
                    </div>
                  <h3 className='font-bold text-xl mb-2 text-gray-100'>Local Services</h3>
                  <p className='text-gray-300 text-sm mb-4'>Access local employment and support services</p>
                    <div className='w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full'></div>
                </Link>
                </div>
            </div>

            {/* 2nd row */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                <div className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                    <div className='bg-gradient-to-br from-red-700 to-red-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaFemale/>
                    </div>
                    <h3 className='font-bold text-xl mb-2 text-gray-100'>Jobs For Women</h3>
                    <p className='text-gray-300 text-sm mb-4'>Specialized employment opportunities for women</p>
                    <div className='w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full'></div>
                </div>

                <div className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                <Link to='/analytics' className='block'>
                    <div className='bg-gradient-to-br from-indigo-700 to-indigo-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaChartLine/>
                    </div>
                    <h3 className='font-bold text-xl mb-2 text-gray-100'>Analytics</h3>
                    <p className='text-gray-300 text-sm mb-4'>Explore job insights, trends and dashboards</p>
                    <div className='w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full'></div>
                </Link>
                </div>

                <div className='group panel-translucent rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                <Link to='https://www.pgrkam.com/search-results/?pwd=1' className='block'>
                    <div className='bg-gradient-to-br from-cyan-700 to-cyan-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaWheelchair/>
                    </div>
                    <h3 className='font-bold text-xl mb-2 text-gray-100'>PWD Jobs</h3>
                    <p className='text-gray-300 text-sm mb-4'>Employment opportunities for persons with disabilities</p>
                    <div className='w-full h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full'></div>
                </Link>
                </div>

                <div className='group panel-translucent rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-[rgba(255,255,255,0.04)]'>
                <Link to='https://www.pgrkam.com/counselling-sessions' className='block'>
                  <div className='bg-gradient-to-br from-green-800 to-green-900 text-white text-4xl rounded-2xl p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <FaComments/>
                    </div>
                  <h3 className='font-bold text-xl mb-2 text-gray-100'>Counselling</h3>
                  <p className='text-gray-300 text-sm mb-4'>Professional career guidance and counseling</p>
                  <div className='w-full h-1 bg-gradient-to-r from-green-600 to-green-800 rounded-full'></div>
                </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Services