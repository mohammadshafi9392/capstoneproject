import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from '../Navbar';
import axios from 'axios';

const SuccessFailure = () => {
    const [SFdata, setSFdata] = useState({});
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'education-chart',
            },
            xaxis: {
                categories: [], // Provide default empty array or the appropriate initial value
            },
            title: {
                // text: 'Education Distribution',
                align: 'center',
            },
        },
        series: [
            {
                name: 'Success',
                data: [], // Provide default empty array or the appropriate initial value
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pgrkam-backend.onrender.com/get-options');
                setSFdata(response.data);
                // console.log((response.data));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const valuesFor2023 = {
        Counselling: SFdata.Counselling ? SFdata.Counselling['2023'] : null,
        'Induction into Armed Forces': SFdata['Induction into Armed Forces'] ? SFdata['Induction into Armed Forces']['2023'] : null,
        Jobs: SFdata.Jobs ? SFdata.Jobs['2023'] : null,
        'Jobs for Persons with Disability': SFdata['Jobs for Persons with Disability'] ? SFdata['Jobs for Persons with Disability']['2023'] : null,
        'Jobs for Women': SFdata['Jobs for Women'] ? SFdata['Jobs for Women']['2023'] : null,
        'Local Services': SFdata['Local Services'] ? SFdata['Local Services']['2023'] : null,
        'Self Employment': SFdata['Self Employment'] ? SFdata['Self Employment']['2023'] : null,
        'Skill Training': SFdata['Skill Training'] ? SFdata['Skill Training']['2023'] : null,
    };

    console.log(valuesFor2023);
    useEffect(() => {
        // Check if SFdata has the necessary keys before updating chartData
        if (Object.keys(SFdata).length > 0) {
            setChartData({
                options: {
                    chart: {
                        id: 'education-chart',
                    },
                    xaxis: {
                        categories: Object.keys(valuesFor2023),
                    },
                    title: {
                        // text: 'Education Distribution',
                        align: 'center',
                    },
                },
                series: [
                    {
                        // name: 'Success',
                        data: Object.values(valuesFor2023),
                    },
                ],
            });
        }
    }, [SFdata]);


    return (
        <div>
            <Navbar />
            <div className='p-10'>
                <h1 className='font-medium'>User Interaction</h1>
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
