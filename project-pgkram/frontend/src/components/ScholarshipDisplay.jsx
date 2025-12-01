// ScholarshipDisplay.jsx
import React from 'react';

const ScholarshipDisplay = ({ scholarship }) => {
  const { head, cat, inc, marks, line } = scholarship;

  return (
    <div className='my-4'>
      <div className='my-2 font-semibold'>{head}</div>
      <div className='text-gray-600'>
        <div>Category: {cat}</div>
        <div>Family Income: {inc}</div>
        <div>Minimum marks: {marks}</div>
        <div>{line}</div>
      </div>
    </div>
  );
};

export default ScholarshipDisplay;
