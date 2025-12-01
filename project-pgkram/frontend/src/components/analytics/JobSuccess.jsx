import React from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

const jobSuccess = () => {
  const [retention,setRetentionData]=useState(null)
  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/traffic-data');
        setTraffic(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTrafficData();
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/get-device');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const fetchRetentionData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/get-retention');
        setRetentionData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRetentionData();
  },[])
  console.log(retention)
  return (
    <div className='demographics p-10 gap-10 flex flex-col overflow-x-hidden items-center justify-between'>
      <div className=' flex items-center justify-between w-full'>
        <div>
          <h1 className='font-medium text-gray-600'><span className='text-violet-600 font'>Success</span>- Users who applied for a job and got accepted</h1>
          <h1 className='font-medium text-gray-600'><span className='text-orange-500'>Failure</span>- Users who applied for a job and got rejected</h1>
        </div>
        <div className='border'>
          <select className='p-2 text-gray-700' name="" id="">
            <option value="">30 days</option>
            <option value="">3 months</option>
            <option value="">6 months</option>
            <option value="">1 year</option>
          </select>
        </div>
      </div>
      <div>

      </div>
      <div className='flex w-96 gap-10 items-center justify-center'>
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
              labels: ["Jun", "July", "August", "Sept", "Nov", "Dec"],
              datasets: [{
                label: "Failure",
                data: [200, 400, 600, 800, 900, 1000],
                backgroundColor: 'rgb(249 115 22 )', // Add the desired color for success
              },]
            }
          }
        />
        

      </div>
    </div>
  )
}

export default jobSuccess