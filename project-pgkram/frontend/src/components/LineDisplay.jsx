import React, { useState } from 'react';

const LineDisplay = (props) => {
  

  return (
    <div className="">
     <div className="bg-green-800 h-2" style={{ width: `${(parseInt(props.no) / 200) * 100}%` }} />
      
    </div>
  );
};

export default LineDisplay;
