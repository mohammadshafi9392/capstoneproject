import React from 'react'

const ProfileForm = () => {
  return (
    <div className='w-full '>
      <div className="shadow">
        <h1 className='p-3 font-medium text-sm'>Your profile will be discovered by recruiters better when you add missing information</h1>
      </div>
      <div className=''>
        <form action="" className='form-light-inputs'>
          <div className='flex flex-col'>

            <div>
              <div className='p-5 flex w-full items-start justify-between pr-10 shadow'>
                <div className='w-1/2'>
                  <h1 className='font-medium text-md'>About</h1>
                  <h1 className='font-normal text-sm text-gray-500'>Tell us about yourself so startups <br />know who you are.</h1>
                </div>
                <div className='w-1/2 flex flex-col gap-5' >
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Your name</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Where are you based?</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>What’s your primary role?</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Your bio</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                </div>

              </div>
              <div className='p-5 flex w-full items-start justify-between pr-10 shadow'>
                <div className='w-1/2'>
                  <h1 className='font-medium text-md'>Your Skills</h1>
                  <h1 className='font-normal text-sm text-gray-500'>What other positions have you held?</h1>
                </div>
                <div className='w-1/2 flex flex-col gap-5' >
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Company</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Title</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                </div>

              </div>

              <div className='p-5 flex w-full items-start justify-between pr-10 shadow'>
                <div className='w-1/2'>
                  <h1 className='font-medium text-md'>Your work experience</h1>
                  <h1 className='font-normal text-sm text-gray-500'>
                    This will help startups hone in on your strengths.</h1>
                </div>
                <div className='w-1/2 flex flex-col gap-5' >
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Company</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Title</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                </div>

              </div>
              <div className='p-5 flex w-full items-start justify-between pr-10 shadow'>
                <div className='w-1/2'>
                  <h1 className='font-medium text-md'>Education</h1>
                  <h1 className='font-normal text-sm text-gray-500'>
                    What schools have you studied at?</h1>
                </div>
                <div className='w-1/2 flex flex-col gap-5' >
                  <div className='flex flex-col justify-start'>
                    <label htmlFor="" className='font-medium text-sm'>Title</label>
                    <input type="text" className='w-full border rounded mt-2' />
                  </div>
                </div>

              </div>
            </div>
            <div className='button-div flex items-center justify-end'>
              <div>


              <button type="submit" className='rounded-sm bg-[#ED9017] w-44 px-3 py-1 my-6 text-white font-semibold text-xs'>Update</button>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileForm