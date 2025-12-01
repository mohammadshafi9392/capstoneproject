// Questionai.jsx

import React, { useState } from 'react';
import Questionui from './Questionui';

const Questionai = () => {
  // Dummy questions from the backend
  const dummyQuestionsFromBackend = [
    'Question 1: What is your favorite programming language?',
    'Question 2: Describe a challenging problem you solved recently.',
    'Question 3: How do you handle stressful situations in a team?',
    'Question 4:how to select all rows in sql in one command?'
    // Add more questions as needed
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextClick = () => {
    if (currentQuestionIndex < dummyQuestionsFromBackend.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle end of questions, e.g., navigate to the next page or perform other actions
    }
  };

  const handleSkipClick = () => {
    if (currentQuestionIndex < dummyQuestionsFromBackend.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle end of questions, e.g., navigate to the next page or perform other actions
    }
  };

  return (
    <div className='flex flex-col justify-center items-center my-10'>
      <div className='w-[80vw] bg-white shadow-2xl p-10'>
        {/* Skip Question button */}
        <div className="flex justify-end">
          <button className="bg-white text-[#ED9017] py-2 px-4" onClick={handleSkipClick}>
            Skip Question
          </button>
        </div>

        {/* Question UI */}
        <Questionui question={dummyQuestionsFromBackend[currentQuestionIndex]} />

        {/* Next button */}
        <div className="flex justify-end items-end mt-auto">
          <button className="bg-[#ED9017] py-2 px-8 rounded-lg text-white" onClick={handleNextClick}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionai;
