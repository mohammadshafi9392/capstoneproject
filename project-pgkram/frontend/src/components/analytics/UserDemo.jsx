import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Navbar from '../Navbar';

const UserDemo = () => {
    const [selectedOption, setSelectedOption] = useState('Age');

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'line-chart',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            title: {
                text: 'User Demographics',
                align: 'center',
            },
        },
        series: [
            {
                name: 'Years',
                data: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011],
            },
            {
                name: 'Age',
                data: [25, 28, 35, 40, 22, 30, 32, 29, 26, 31, 34, 27],
            },
        ],
    });

    useEffect(() => {
        const updateChartData = () => {
            if (selectedOption === 'Age') {
                setChartData({
                    options: {
                        chart: {
                            id: 'age-chart',
                        },
                        xaxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        },
                        title: {
                            text: 'Age Distribution',
                            align: 'center',
                        },
                    },
                    series: [
                        {
                            name: 'Age',
                            data: [25, 28, 35, 40, 22, 30, 32, 29, 26, 31, 34, 27],
                        },
                    ],
                });
            } else if (selectedOption === 'Gender') {
                setChartData({
                    options: {
                        chart: {
                            id: 'gender-chart',
                        },
                        xaxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        },
                        title: {
                            text: 'Gender Distribution',
                            align: 'center',
                        },
                    },
                    series: [
                        {
                            name: 'Male',
                            data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38],
                        },
                        {
                            name: 'Female',
                            data: [8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35],
                        },
                    ],
                });
            } else if (selectedOption === 'Education') {
                setChartData({
                    options: {
                        chart: {
                            id: 'education-chart',
                        },
                        xaxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        },
                        title: {
                            text: 'Education Distribution',
                            align: 'center',
                        },
                    },
                    series: [
                        {
                            name: 'High School',
                            data: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42],
                        },
                        {
                            name: 'Bachelor\'s Degree',
                            data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38],
                        },
                        {
                            name: 'Master\'s Degree',
                            data: [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32],
                        },
                    ],
                });
            } else if (selectedOption === 'Industry') {
                setChartData({
                    options: {
                        chart: {
                            id: 'industry-chart',
                        },
                        xaxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        },
                        title: {
                            text: 'Industry Distribution',
                            align: 'center',
                        },
                    },
                    series: [
                        {
                            name: 'Technology',
                            data: [20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48],
                        },
                        {
                            name: 'Healthcare',
                            data: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42],
                        },
                    ],
                });
            }
        };

        updateChartData();
    }, [selectedOption]);

    return (
        <div>
            <Navbar />
            <div className='p-10'>
        <h1 className='font-medium'>User Demographics</h1>
        <h1 className='font-medium text-gray-400 text-sm'>Control and analyse your data in the most convenient way</h1>
      </div>
            <div className='px-10'>
                <label className='border p-2 block'>Select an option:</label>
                <select
                    className='border p-2 mt-2'
                    onChange={(e) => handleOptionChange(e.target.value)}
                    value={selectedOption || ''}
                >
                    <option value="">Select...</option>
                    <option value="Age">Age</option>
                    <option value="Gender">Gender</option>
                    <option value="Education">Education</option>
                    <option value="Industry">Industry</option>
                </select>
                <p className='mt-2'>Selected option: <span className=' bg-green-400 p-1 rounded-md'> {selectedOption}</span></p>
            </div>
            <div className='shadow flex items-center justify-center'>
                <div className='p-4'>
                    <Chart options={chartData.options} series={chartData.series} type='bar' width={700} />
                </div>
            </div>
        </div>
    );
};

export default UserDemo;
