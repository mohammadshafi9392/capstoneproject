import React ,{useEffect,useState}from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import axios from 'axios';
const Insights = () => {
  const [dataSalary,setDataSalary]=useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/get-average-salary');
        setDataSalary(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[])
  console.log(dataSalary)
  return (
    <div className='demographics p-10 gap-10 flex flex-col overflow-x-hidden items-center justify-between'>
      <div className=' flex items-center justify-between w-full'>

        <div className='border'>
          <select className='p-4 w-[40rem] text-gray-700' name="" id="">
            <option value="">Select Industry Field</option>
            <option value="UI/Designer">UI/Designer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="ML Engineer">ML Engineer</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>

        <div className=' border'>
          <select className='p-2 w-[20rem] text-gray-700' name="" id="">
            <option value="">30 days</option>
            <option value="">3 months</option>
            <option value="">6 months</option>
            <option value="">1 year</option>
          </select>
        </div>
      </div>
      <div>

      </div>
      <div className='flex w-auto gap-10 items-center justify-center'>
        <div className=''>

          <Line
            data={{
              labels: ["Jun", "July", "August", "Sept", "Nov", "Dec"],
              datasets: [
                {
                  label: "UI/UX Designer",
                  data: [200, 400, 600, 800, 900, 1000],
                  borderColor: 'rgb(249, 115, 22)', // Add the desired color for the line
                  backgroundColor: 'rgba(0, 0, 0, 0)', // Optional: Set background color to make it transparent
                  borderWidth: 2, // Add the desired line width
                },
              ],
            }}
          />
        </div>
        <div>
          <h1 className='text-violet-600  text-gray-700 font-medium'>INR 55,233</h1>
          <h1 className='font-medium text-gray-700 opacity-90'>Average UI/UX Designer Salary</h1>
        </div>

      </div>
    </div>
  )
}

export default Insights