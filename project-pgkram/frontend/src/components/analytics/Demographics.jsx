import React, { useState,useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import axios from 'axios';
const Demographics = () => {
  const [first, setfirst] = useState('agengender');
  const [Genderdata,setGenderData]=useState(null);
  const [Locationdata,setLocationData]=useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/gender-data');
        setGenderData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchLocationData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/location-data');
        setGenderData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    fetchLocationData();
  },[])
console.log(Genderdata)
console.log(Locationdata)
  return (
    <div className='flex flex-col items-center justify-center gap-10'>
      <div className='flex items-center w-4/5 justify-between m-10 font-medium text-gray-700'>
        <div className='flex '>
          <div className='border'>
            <button className=' p-4' onClick={() => setfirst('agengender')} >
              Age & Gender
            </button>
            <div className={`${first === 'agengender' ? 'flex' : "hidden"} bg-orange-600 h-1`}></div>
          </div>
          <div className='border'>
            <button className=' p-4' onClick={() => setfirst('location')}>
              Location
            </button>
            <div className={`${first === 'location' ? 'flex' : "hidden"} bg-orange-600 h-1`}></div>

          </div>

        </div>
        <div>
          <div className=' border'>
            <select className='p-2 text-gray-700' name="" id="">
              <option value="">30 days</option>
              <option value="">3 months</option>
              <option value="">6 months</option>
              <option value="">1 year</option>
            </select>
          </div>
        </div>

      </div>
      <div className={`${first === 'agengender' ? 'flex' : "hidden"} w-[400px]  gap-10 items-center justify-center`}>
        <Bar
          data={
            {
              labels: ["Jun", "July", "August", "Sept", "Nov", "Dec"],
              datasets: [{
                label: "Success",
                data: [200, 400, 600, 800, 900, 1000],
                backgroundColor: 'rgb(124 58 237)', // Add the desired color for success
              },]
            }
          }
        />
        <Bar
          data={
            {
              labels: ['male', 'female'],
              datasets: [{
                label: "Failure",
                data: [25, 50, 75],
                backgroundColor: 'rgb(249 115 22 )', // Add the desired color for success
              },]
            }
          }
        />


      </div>
      <div className={`${first === 'location' ? 'flex' : "hidden"} w-[500px]  gap-10 items-center justify-between`}>
        <Bar
          data={
            {
              labels: ["Amritsar", "Jalandhar", "bathinda", "kapurthala", "ludhiana", "patiala", "others"],
              datasets: [{
                label: "Success",
                data: [15, 30, 45, 45, 62, 11, 43],
                backgroundColor: 'rgb(124 58 237)', // Add the desired color for success
              },]
            }
          }
        />


      </div>
    </div>
  )
}

export default Demographics