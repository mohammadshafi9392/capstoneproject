import React from 'react';
import PropTypes from 'prop-types';

const CircularProgressBar = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = percentage * circumference / 100;

  return (
    <div className="text-center">
      <svg className="mx-auto" width="120" height="120">
        <circle
          className="stroke-current text-[#2563eb]"
          strokeWidth="6"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: circumference - progress,
          }}
        />
        <text x="40%" y="50%" className="fill-current text-lg font-bold">
          {percentage}%
        </text>
      </svg>
      <div>You are {percentage}% Compatible with this job</div>
    </div>
  );
};

CircularProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default CircularProgressBar;
