import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from '../Navbar';
import axios from 'axios';




// / Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { logEvent } from 'firebase/analytics';
// import { useEffect } from 'react'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtN5KQkpsXzN1zqvQVt1djUKLrsP_uDP8",
  authDomain: "pgrkam-117c0.firebaseapp.com",
  databaseURL: "https://pgrkam-117c0-default-rtdb.firebaseio.com",
  projectId: "pgrkam-117c0",
  storageBucket: "pgrkam-117c0.appspot.com",
  messagingSenderId: "980934921200",
  appId: "1:980934921200:web:126d7d851381bc022b2b35",
  measurementId: "G-MFTHEZYJ0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// function App() {

  

const SuccessFailure = () => {
    const [SFdata, setSFdata] = useState({});
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'education-chart',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            title: {
                // text: 'Education Distribution',
                align: 'center',
            },
        },
        series: [
            {
                name: 'Success',
                data: [45, 68, 40, 72, 55, 48, 40, 32, 35, 78, 60, 82],
            },
            {
                name: 'Failure',
                data: [30, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38],
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pgrkam-backend.onrender.com/get-success');
                setSFdata(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setChartData((prevChartData) => ({
            ...prevChartData,
            series: [
                {
                    name: 'Success',
                    data: SFdata.Success_data || [],
                },
                {
                    name: 'Failure',
                    data: SFdata.Failure || [],
                },
            ],
        }));
    }, [SFdata]);


    useEffect(() => {
        console.log(analytics); // Check if 'logEvent' is present
        logEvent(analytics, 'component_mount', {
          componentName: 'SuccessFailure', // Replace with your actual component name
        });
      }, []);

    return (
        <div>
            <Navbar />
            <div className='p-10'>
                <h1 className='font-medium'>Job Success Failure ratio</h1>
                <h1 className='font-medium text-gray-400 text-sm'>Control and analyse your data in the most convenient way</h1>
            </div>
            <div className='shadow flex items-center justify-center'>
                <div className='p-4'>
                    <Chart options={chartData.options} series={chartData.series} type='bar' width={700} />
                </div>
            </div>
        </div>
    );
};

export default SuccessFailure;
