import React from 'react';

const Skillai = (props) => {
  const { skill, isSelected, onClick } = props;

  return (
    <div className="flex f flex-wrap justify-center">
      <div
        className={`cursor-pointer w-32 my-2 border py-1 px-2 rounded-md mx-2 ${
          isSelected ? 'bg-[#4329EA] text-white' : 'border-black'
        }`}
        onClick={onClick}
      >
        {skill}
      </div>
    </div>
  );
};

export default Skillai;
