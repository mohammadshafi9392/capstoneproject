import React, { useState } from 'react';
import Scholarships from './Scholarships';
import AIInterview from './AIInterview';
import MyJobs from './MyJobs';
import ViewProfile from './ViewProfile';

const ProfileOptions = () => {
  const [activeButton, setActiveButton] = useState('View profile');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className=''>
      <div className=' items-center flex gap-10 p-5 text-[12px] text-gray-600 shadow-md'>

        <div className={`relative group flex flex-col items-center`}>
          <button className={`hover:text-gray-900`} onClick={() => handleButtonClick('View profile')}>
            View profile
          </button>
          {activeButton === 'View profile' && (
            <div className="mt-1 rounded-2xl bg-violet-500 h-1 w-4"></div>
          )}
        </div>

        <div className={`relative group  flex flex-col items-center`}>
          <button className={`hover:text-gray-900`} onClick={() => handleButtonClick('My jobs')}>
            My jobs
          </button>
          {activeButton === 'My jobs' && (
            <div className="mt-1 rounded-2xl bg-violet-500 h-1 w-4"></div>
          )}
        </div>
        <div className={`relative group  flex flex-col items-center`}>
          <button className={`hover:text-gray-900`} onClick={() => handleButtonClick('AI Interview')}>
            AI Interview
          </button>
          {activeButton === 'AI Interview' && (
            <div className="mt-1 rounded-2xl bg-violet-500 h-1 w-4"></div>
          )}
        </div>

        <div className={`relative group  flex flex-col items-center`}>
          <button className={`hover:text-gray-900`} onClick={() => handleButtonClick('Scholarship')}>
            Scholarship
          </button>
          {activeButton === 'Scholarship' && (
            <div className="mt-1 rounded-2xl bg-violet-500 h-1 w-4"></div>
          )}
        </div>
      </div>

      <div>
        {activeButton === 'View profile' && <ViewProfile />}
        {activeButton === 'My jobs' && <MyJobs />}
        {activeButton === 'AI Interview' && <AIInterview />}
        {activeButton === 'Scholarship' && <Scholarships />}
      </div>
    </div>
  );
}

export default ProfileOptions;
