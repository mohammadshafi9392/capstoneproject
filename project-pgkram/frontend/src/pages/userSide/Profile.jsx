import React, { useState } from 'react'
import { FaQrcode } from 'react-icons/fa';
import { Line } from 'react-chartjs-2'
// import ProfileForm from './profileForm';

const Profile = () => {
  const [qrcode, setQr] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showProfile, setShowProfile] = useState(false)
  const [updateDetails, setupdateDetails] = useState(false)

  const handleUploadResume = (file) => {
    setSelectedResume(file);
    setShowUploadModal(false);
    // Perform additional actions if needed
  };

  const handleUpdate=()=>{
    setShowProfile(false);
    setupdateDetails(true);
  }
  const handleEditprofile=()=>{
    setShowProfile(true);
    setupdateDetails(false);
  }
  return (
    // <div className='m-10 gap-2 flex flex-col'>
    //   <div className='progress-bar flex w-1/2 gap-1 items-center justify-start'>
    //     <div className='bg-gray-300 w-16 h-2'></div>
    //     <div className='bg-green-600 w-16 h-2'></div>
    //     <div className='bg-green-600 w-16 h-2'></div>
    //     <div className='bg-green-600 w-16 h-2'></div>
    //     <div className='bg-green-600 w-16 h-2'></div>
    //   </div>

    //   <div className='info-card font-medium text-sm'> Your profile will be discovered by recruiters better when you add missing information</div>

    //   <div className="user-card flex items-center justify-between bg-gray-100 p-3 rounded-md">
    //     <div className='flex items-center justify-center gap-2'>
    //       <div className='flex items-center justify-center rounded-full'>
    //         <img src="https://placehold.co/50" alt="" className='rounded-full' />
    //       </div>
    //       <div>
    //         <h1 className='font-medium text-lg'>Rohan</h1>
    //         {/* <h1 className='font-normal text-sm text-gray-600'>MERN Developer, Developer @GDSC</h1> */}
    //         {/* <h1 className='font-normal text-sm text-gray-600'>Noida</h1> */}
    //       </div>
    //     </div>
    //     <div className='flex gap-1 items-center justify-between'>
    //       <button onClick={handleEditprofile} className=' rounded-sm bg-[#ED9017] px-3 py-1 my-2 text-white uppercase font-semibold text-xs'>Edit profile</button>
    //       <button onClick={() => setShowUploadModal(true)} className=' rounded-sm bg-[#ED9017] px-3 py-1 my-2 text-white uppercase font-semibold text-xs'>Upload resume</button>
    //       <button onClick={() => setQr(true)}>
    //         <FaQrcode className='w-6 h-6 rounded-sm text-orange-400 ' />
    //       </button>
    //     </div>
    //   </div>

      // <div className={`${showProfile ? 'flex' : 'hidden'} profile-form`}>
      //   {/* <ProfileForm /> */}
      //   <button onClick={handleUpdate} className='rounded-sm bg-[#ED9017] px-3 py-1 my-2 text-white uppercase font-semibold text-xs'>Update</button>
      // </div>

    //   <div className={`${updateDetails ? 'flex' : 'hidden'} flex-col gap-2 profile-form`}>
    //     <div className="user-stats flex justify-start gap-2">
    //       <div className='flex p-2 gap-2 bg-gray-100 rounded-md'>
    //         <div>
    //           <h1 className='text-sm text-gray-500'>Profile views</h1>
    //           <h1 className='font-bold text-3xl text-gray-700'>246</h1>
    //           <h1 className='mt-10 font-bold text-xl text-purple-700'>+2.5%</h1>
    //         </div>
    //         <div className='w-52'>
    //           <Line
    //             data={{
    //               labels: [" ", " ", " ", " ", " ", " "],
    //               datasets: [
    //                 {
    //                   label: " ",
    //                   data: [200, 400, 600, 800, 900, 1000],
    //                   borderColor: 'rgb(249, 115, 22)', // Add the desired color for the line
    //                   backgroundColor: 'rgba(0, 0, 0, 0)', // Optional: Set background color to make it transparent
    //                   borderWidth: 2, // Add the desired line width
    //                 },
    //               ],
    //             }}
    //           />
    //         </div>
    //       </div>
    //       <div className='flex p-2 gap-2 bg-gray-100 rounded-md'>
    //         <div>
    //           <h1 className='text-sm text-gray-500'>Resume Score</h1>
    //           <h1 className='font-bold text-3xl text-gray-700'>85</h1>
    //           <h1 className='mt-10 font-bold text-xl text-purple-700'>+1.5%</h1>
    //         </div>
    //         <div className='w-52'>
    //           <Line
    //             data={{
    //               labels: [" ", " ", " ", " ", " ", " "],
    //               datasets: [
    //                 {
    //                   label: " ",
    //                   data: [200, 400, 600, 800, 900, 1000],
    //                   borderColor: 'rgb(249, 115, 22)', // Add the desired color for the line
    //                   backgroundColor: 'rgba(0, 0, 0, 0)', // Optional: Set background color to make it transparent
    //                   borderWidth: 2, // Add the desired line width
    //                 },
    //               ],
    //             }}
    //           />
    //         </div>
    //       </div>
    //       <div className='flex p-2 gap-2 bg-gray-100 rounded-md'>
    //         <div>
    //           <h1 className='text-sm text-gray-500'>Search appearcances</h1>
    //           <h1 className='font-bold text-3xl text-gray-700'>461</h1>
    //           <h1 className='mt-10 font-bold text-xl text-purple-700'>-4.4%</h1>
    //         </div>
    //         <div className='w-52'>
    //           <Line
    //             data={{
    //               labels: [" ", " ", " ", " ", " ", " "],
    //               datasets: [
    //                 {
    //                   label: " ",
    //                   data: [200, 400, 600, 800, 900, 1000],
    //                   borderColor: 'rgb(249, 115, 22)', // Add the desired color for the line
    //                   backgroundColor: 'rgba(0, 0, 0, 0)', // Optional: Set background color to make it transparent
    //                   borderWidth: 2, // Add the desired line width
    //                 },
    //               ],
    //             }}
    //           />
    //         </div>
    //       </div>
    //       <div className='flex p-2 gap-2 bg-gray-100 rounded-md w-full'>
    //         <div>
    //           <h1 className='text-sm text-gray-500'>Jobs applied</h1>
    //           <h1 className='font-bold text-3xl text-gray-700'>26</h1>
    //         </div>

    //       </div>
    //     </div>

    //     {/* Check if the upload modal should be visible */}
    //     {showUploadModal && (
    //       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
    //         <div className="bg-white w-2/5 h-2/5 flex m-auto flex-col justify-evenly items-center p-6 rounded-md relative">
    //           <button
    //             className="absolute top-2 right-2 text-gray-700 text-lg cursor-pointer"
    //             onClick={() => setShowUploadModal(false)}
    //           >
    //             &#10005;
    //           </button>
    //           <h2 className="font-medium text-lg mb-4">Upload Resume</h2>
    //           <input
    //             type="file"
    //             onChange={(e) => handleUploadResume(e.target.files[0])}
    //             className="mb-4"
    //           />
    //           <button
    //             onClick={() => setShowUploadModal(false)}
    //             className="bg-gray-500 text-white px-4 py-2 rounded-md"
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     )}

    //     <div className="dream-job bg-gray-100 rounded-md p-3 flex flex-col gap-2">
    //       <h1 className='font-medium text-lg'>Career path</h1>
    //       <input type="text" name="" id="" className='w-52 rounded-md border-orange-600 border hover:border-gray-400' />
    //     </div>
    //     <div className="user-about bg-gray-100 p-3 rounded-md">
    //       <h1 className='font-medium text-lg'>About</h1>
    //       <p className='font-normal text-sm text-gray-600'>I'm an engineering undergrad specializing in IT. I've a keen interest in designing and programming.I am an avid learner and always open to new challenges.</p>
    //     </div>
    //     <div className="user-exprerience  bg-gray-100 p-3 rounded-md">
    //       <h1 className='font-medium text-lg'>Experience</h1>
    //       <div className='flex flex-col gap-2'>
    //         <div className='flex gap-2 items-start'>
    //           <div>
    //             <img src="https://placehold.co/50" alt="" className='rounded-full mt-2' />
    //           </div>
    //           <div>
    //             <h1 className='font-medium text-lg text-gray-700'>Junior designer</h1>
    //             <h1 className='font-normal text-sm text-gray-500'>Physics wallah</h1>
    //             <h1 className='font-normal text-sm text-gray-500'>May 2021-Sep 2022</h1>
    //           </div>
    //         </div>
    //         <div className='flex gap-2 items-start'>
    //           <div>
    //             <img src="https://placehold.co/50" alt="" className='rounded-full mt-2' />
    //           </div>
    //           <div>
    //             <h1 className='font-medium text-lg text-gray-700'>Junior designer</h1>
    //             <h1 className='font-normal text-sm text-gray-500'>Physics wallah</h1>
    //             <h1 className='font-normal text-sm text-gray-500'>May 2021-Sep 2022</h1>
    //           </div>
    //           <hr />
    //         </div>

    //       </div>
    //     </div>
    //   </div>


    // </div>

    <div className='w-'>hi</div>
  )
}

export default Profile