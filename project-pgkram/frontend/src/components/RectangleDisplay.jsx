import React, { useState } from 'react';

const RectangleDisplay = (props) => {
  const [numberOfRectangles, setNumberOfRectangles] = useState(1);
  

  const renderRectangles = () => {
    const rectangles = [];
    for (let i = 0; i < 5; i++) {
      const isFilled = i < parseInt(props.no);
      rectangles.push(
        <div
          key={i}
          style={{
            width: '60px',
            height: '10px',
            backgroundColor: isFilled ? 'green' : 'transparent',
            border: '1px solid black',
            margin: '1px',
          }}
        ></div>
      );
    }
    return rectangles;
  };

  return (
    <div>

      <div style={{ display: 'flex' }}>{renderRectangles()}</div>
    </div>
  );
};

export default RectangleDisplay;
