// Scholarships.jsx
import React from 'react';
import ScholarshipDisplay from '../../components/ScholarshipDisplay';

const scholarshipData = [
  {
    head: 'Post-matric scholarship for SC students',
    cat: 'SC',
    inc: '2.5 lakh',
    marks: '75% in Higher secondary',
    line: 'Should not be availing any other centrally-sponsored PMS, Must be studying in 11th or 12th class',
  },
  {
    head: 'Post-matric scholarship for Minority category students',
    cat: 'Minority (Sikhs, Muslims, Christians, Buddhists, Jains and Parsis)',
    inc: '2 lakh',
    marks: '50% in previous final exams',
    line: 'Not more than two students of a family can avail this Punjab scholarship 2023. Must be studying a higher secondary/UG/PG course',
  },
  {
    head: 'Pre-matric scholarship for SC',
    cat: 'SC',
    inc: '2.5 lakh',
    line: 'Should not be availing any other centrally-sponsored PMS. Must be studying in 9th or 10th class. He/she must possess an Aadhar card',
  },
];

const Scholarships = () => {
  return (
    <div className='shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-4/5 my-12 mx-auto flex flex-col p-4 text-left'>
      <div>
        <div className='text-[22px] font-semibold'>Government-funded postgraduate scholarships</div>

        {scholarshipData.map((scholarship, index) => (
          <ScholarshipDisplay key={index} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
};

export default Scholarships;
