import React, { useState } from 'react';
import Skillai from '../../components/Skill-ai';
import Questionai from '../../components/Questionai'; // Import your Questionai component

const AIInterview = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showQuestionComponent, setShowQuestionComponent] = useState(false);

  const handleSkillClick = (clickedSkill) => {
    const isSkillSelected = selectedSkills.includes(clickedSkill);

    if (!isSkillSelected) {
      setSelectedSkills([...selectedSkills, clickedSkill]);
    } else {
      const updatedSkills = selectedSkills.filter(skill => skill !== clickedSkill);
      setSelectedSkills(updatedSkills);
    }
  };

  const handleNextButtonClick = () => {
    setShowQuestionComponent(true);
  };

  const skillsFromBackend = ['HR', 'Spoken English', 'DBMS', 'Financial Accounting', 'Marketing Management','Front End' , 'Back End', 'Android Development','Designing','Machine Learning','SQL','Databases'];

  return (
    <div className='flex flex-col'>
      {!showQuestionComponent ? (
        <div className='m-10 h-[50vh] shadow-2xl p-10'>
          <div className='text-gray-600 my-8'>Choose your skills, and let our AI generate tailored questions</div>

          <div className='flex'>
            {skillsFromBackend.map((skill, index) => (
              <Skillai
                key={index}
                skill={skill}
                isSelected={selectedSkills.includes(skill)}
                onClick={() => handleSkillClick(skill)}
              />
            ))}
          </div>

          {/* Display selected skills */}
          {selectedSkills.length > 0 && (
            <div className='mt-4'>
              <h2 className='text-lg font-semibold'>Selected Skills:</h2>
              <div>
                {selectedSkills.map((selectedSkill, index) => (
                  <div key={index} className='bg-blue-500 text-white inline-block px-2 py-1 m-1 rounded-md'>
                    {selectedSkill}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='flex justify-end items-end'>
            <button className='bg-[#ED9017] py-2 px-8 rounded-lg text-white' onClick={handleNextButtonClick}>
              NEXT
            </button>
          </div>
        </div>
      ) : (
        <Questionai />
      )}
    </div>
  );
};

export default AIInterview;
