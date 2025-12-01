import React, { useState } from "react";
import ReactApexCharts from "react-apexcharts";
import Navbar from "../Navbar";
import Chart from 'react-apexcharts';

const ActiveUser = () => {
  const data = [
    { x: 'Mon', y: '12 AM', value: Math.random() * 100 },
    { x: 'Mon', y: '1 AM', value: Math.random() * 100 },
    { x: 'Mon', y: '2 AM', value: Math.random() * 100 },
    // ... more data points for all days and times
    { x: 'Sun', y: '11 PM', value: Math.random() * 100 },
  ];

  // Replace 'days' and 'timeSlots' with your actual categories
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['12 AM', '1 AM', '2 AM', /* ... more times */];

  const options = {
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
    xaxis: {
      categories: days,
    },
    yaxis: {
      categories: timeSlots,
    },
  };

  
  return (
    <div className="h-max bg-gray-100 ">
      <Navbar />
      <div className="pt-8 px-20">
        <div className="font-bold text-[20px]">Active Users</div>
        <div className="text-gray-600 font-semibold">
          Control and analyse your data in the most convenient way
        </div>
      </div>
      <div className="mx-auto rounded-lg mt-12  w-max bg-white p-10 text-[20px] text-center">
        <div>
        <Chart options={options} series={data} type="heatmap" width={800} />
        </div>
      </div>
    </div>
  );
};

export default ActiveUser;
