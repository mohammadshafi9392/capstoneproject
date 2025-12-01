import React,{useState} from 'react'
import Navbar from '../../components/Navbar'
import Jobs from './Jobs';
import AppliedJobs from './AppliedJobs';
import Notifications from './Notifications';
import Messages from './Messages';
import Scholarships from './Scholarships';
import { FaBriefcase, FaFileAlt, FaBell, FaEnvelope, FaGraduationCap, FaUser } from 'react-icons/fa';
import ProfileOptions from './ProfileOptions';

const User = (props) => {

    const [showJobs, setShowJobs] = useState(true);
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    const [showNoti, setShowNoti] = useState(false);
    const [showMsgs, setShowMsgs] = useState(false);
    const [showSch, setShowSch] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const handleJobsClick = () => {
        setShowJobs(true);
        setShowAppliedJobs(false);
        setShowNoti(false);
        setShowMsgs(false);
        setShowSch(false);
        setShowProfile(false);
      };
      const handleAppliedJobsClick = () => {
        setShowJobs(false);
        setShowAppliedJobs(true);
        setShowNoti(false);
        setShowMsgs(false);
        setShowSch(false);
        setShowProfile(false);
      };
      const handleNotiClick = () => {
        if(showNoti)
        {setShowNoti(false)}
        else
        setShowNoti(true);
      };
      const handleMessagesClick = () => {
        setShowJobs(false);
        setShowAppliedJobs(false);
        setShowNoti(false);
        setShowMsgs(true);
        setShowSch(false);
        setShowProfile(false);
      };
      const handleSchClick = () => {
        setShowJobs(false);
        setShowAppliedJobs(false);
        setShowNoti(false);
        setShowMsgs(false);
        setShowSch(true);
        setShowProfile(false);
      };
      const handleProfileClick = () => {
        setShowJobs(false);
        setShowAppliedJobs(false);
        setShowNoti(false);
        setShowMsgs(false);
        setShowSch(false);
        setShowProfile(true);
      };

  return (
    <div className='min-h-screen bg-slate-50'>
        <Navbar/>
        
        {/* Modern Sidebar Navigation */}
        <div className='flex'>
          <div className='w-64 bg-white shadow-lg min-h-screen'>
            <div className='p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>Dashboard</h2>
              
              <nav className='space-y-2'>
                <button 
                  onClick={handleJobsClick}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    showJobs ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaBriefcase className={`mr-3 ${showJobs ? 'text-white' : 'text-[#2563eb]'}`} />
                  <span className='font-medium'>Jobs</span>
                </button>

                <button 
                  onClick={handleAppliedJobsClick}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    showAppliedJobs ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaFileAlt className={`mr-3 ${showAppliedJobs ? 'text-white' : 'text-[#ED9017]'}`} />
                  <span className='font-medium'>Applied Jobs</span>
                </button>

                <button 
                  onClick={handleNotiClick}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    showNoti ? 'bg-gradient-to-r from-[#ED9017] to-[#FF6B35] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaBell className={`mr-3 ${showNoti ? 'text-white' : 'text-[#ED9017]'}`} />
                  <span className='font-medium'>Notifications</span>
                </button>

                <button 
                  onClick={handleMessagesClick}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    showMsgs ? 'bg-gradient-to-r from-[#ED9017] to-[#FF6B35] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaEnvelope className={`mr-3 ${showMsgs ? 'text-white' : 'text-[#ED9017]'}`} />
                  <span className='font-medium'>Messages</span>
                </button>

                <button 
                  onClick={handleSchClick}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    showSch ? 'bg-gradient-to-r from-[#ED9017] to-[#FF6B35] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaGraduationCap className={`mr-3 ${showSch ? 'text-white' : 'text-[#ED9017]'}`} />
                  <span className='font-medium'>Scholarships</span>
                </button>

                <button 
                  onClick={handleProfileClick}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    showProfile ? 'bg-gradient-to-r from-[#ED9017] to-[#FF6B35] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaUser className={`mr-3 ${showProfile ? 'text-white' : 'text-[#ED9017]'}`} />
                  <span className='font-medium'>Profile</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 p-6'>
            <div className='bg-white rounded-2xl shadow-lg min-h-[calc(100vh-120px)]'>
              {showJobs && <Jobs/>}
              {showAppliedJobs && <AppliedJobs/>}
              {showNoti && <Notifications/>}
              {showMsgs && <Messages/>}
              {showSch && <Scholarships/>}
              {showProfile && <ProfileOptions/>}
            </div>
          </div>
        </div>
    </div>
    
  )
}

export default User