import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import Chart from 'react-apexcharts';
import Select from 'react-select';

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'line-chart',
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: 'Retention Rate',
        align: 'center',
      },
    },
    series: [
      {
        name: 'New Users',
        data: [],
      },
      {
        name: 'Returning Users',
        data: [],
      },
    ],
  });

  const [retention, setRetentionData] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('BothUsers');
  const [isFilterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchRetentionData = async () => {
      try {
        const response = await axios.get('https://pgrkam-backend.onrender.com/get-retention');
        setRetentionData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRetentionData();
  }, []);

  useEffect(() => {
    if (retention && retention.NewGraph && retention.NewGraph['2023'] && retention.ReturningGraph && retention.ReturningGraph['2023']) {
      const categories = Object.keys(retention.NewGraph['2023']);
      const newUsersData = Object.values(retention.NewGraph['2023']);
      const returningUsersData = Object.values(retention.ReturningGraph['2023']);

      if (selectedFilter === 'BothUsers') {
        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: categories,
            },
            title: {
              ...chartData.options.title,
              text: 'Retention Rate - Both Users',
            },
          },
          series: [
            {
              name: 'New Users',
              data: newUsersData,
            },
            {
              name: 'Returning Users',
              data: returningUsersData,
            },
          ],
        });
      } else {
        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: categories,
            },
            title: {
              ...chartData.options.title,
              text: `Retention Rate - ${selectedFilter === 'NewGraph' ? 'New Users' : 'Returning Users'}`,
            },
          },
          series: [
            {
              name: selectedFilter === 'NewGraph' ? 'New Users' : 'Returning Users',
              data: selectedFilter === 'NewGraph' ? newUsersData : returningUsersData,
            },
            {
              name: selectedFilter === 'BothUsers' ? 'Returning Users' : '',
              data: selectedFilter === 'BothUsers' ? returningUsersData : [],
            },
          ],
        });
      }
    }
  }, [retention, selectedFilter, chartData.options]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setFilterOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className='p-10'>
        <h1 className='font-medium'>Retention Rate</h1>
        <h1 className='font-medium text-gray-400 text-sm'>Control and analyse your data in the most convenient way</h1>
      </div>
      <div className='px-10'>
        {/* Filter */}
        <div className='relative inline-block text-left'>
          <button
            onClick={() => setFilterOpen(!isFilterOpen)}
            type='button'
            className='w-32 outline-none inline-flex justify-center items-center p-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
          >
            Filter
          </button>
          {isFilterOpen && (
            <div className='absolute right-0 left-10 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
              <div className='py-1'>
                <button
                  type='button'
                  className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                    selectedFilter === 'ReturningGraph' ? 'bg-gray-100 text-gray-900' : ''
                  }`}
                  onClick={() => handleFilterClick('ReturningGraph')}
                >
                  Returning Users
                </button>
                <button
                  type='button'
                  className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                    selectedFilter === 'NewGraph' ? 'bg-gray-100 text-gray-900' : ''
                  }`}
                  onClick={() => handleFilterClick('NewGraph')}
                >
                  New Users
                </button>
                <button
                  type='button'
                  className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                    selectedFilter === 'BothUsers' ? 'bg-gray-100 text-gray-900' : ''
                  }`}
                  onClick={() => handleFilterClick('BothUsers')}
                >
                  Both Users
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='shadow flex items-center justify-center'>
          <div className='p-4'>
            <Chart options={chartData.options} series={chartData.series} type='line' width={700} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
