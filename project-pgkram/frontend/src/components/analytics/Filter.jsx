// Filter.js
import React, { useState } from 'react';
import Select from 'react-select';

const Filter = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [selectedIndustry, setSelectedIndustry] = useState(null);

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleOptionChange = (selectedOption) => {
        setSelectedOption(selectedOption);

        // Reset other filters when a new option is selected
        setMinAge('');
        setMaxAge('');
        setSelectedGender(null);
        setSelectedEducation(null);
        setSelectedIndustry(null);
    };

    const handleApplyFilters = () => {
        console.log('Selected Option:', selectedOption);
        console.log('Min Age:', minAge);
        console.log('Max Age:', maxAge);
        console.log('Selected Gender:', selectedGender);
        console.log('Selected Education:', selectedEducation);
        console.log('Selected Industry:', selectedIndustry);
    };

    const getDropdownForOption = (option) => {
        switch (option) {
            case 'age':
                return (
                    <div>
                        <label>Min Age:</label>
                        <input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
                        <label>Max Age:</label>
                        <input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
                    </div>
                );
            case 'gender':
                const genderOptions = [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'trans', label: 'Trans' },
                ];
                return (
                    <Select
                        options={genderOptions}
                        value={selectedGender}
                        onChange={(selectedOption) => setSelectedGender(selectedOption)}
                        placeholder="Select Gender"
                    />
                );
            case 'education':
                const educationOptions = [
                    { value: '10th', label: '10th Passout' },
                    { value: '12th', label: '12th Passout' },
                    { value: 'graduate', label: 'Graduate' },
                    { value: 'undergraduate', label: 'Undergraduate' },
                ];
                return (
                    <Select
                        options={educationOptions}
                        value={selectedEducation}
                        onChange={(selectedOption) => setSelectedEducation(selectedOption)}
                        placeholder="Select Education"
                    />
                );
            case 'industry':
                const industryOptions = [
                    { value: 'computerScience', label: 'Computer Science' },
                    { value: 'civil', label: 'Civil' },
                    { value: 'electrical', label: 'Electrical' },
                    { value: 'medical', label: 'Medical' },
                    { value: 'business', label: 'Business' },
                ];
                return (
                    <Select
                        options={industryOptions}
                        value={selectedIndustry}
                        onChange={(selectedOption) => setSelectedIndustry(selectedOption)}
                        placeholder="Select Industry"
                    />
                );
            default:
                return null;
        }
    };

    const filterOptions = [
        { value: 'age', label: 'Age' },
        { value: 'gender', label: 'Gender' },
        { value: 'education', label: 'Education' },
        { value: 'industry', label: 'Industry' },
    ];

    return (
        <div>
            <button onClick={handleFilterToggle}>Filter</button>
            {isFilterOpen && (
                <div>
                    <Select
                        options={filterOptions}
                        value={selectedOption}
                        onChange={handleOptionChange}
                        placeholder="Select Filter Option"
                    />
                    {selectedOption && getDropdownForOption(selectedOption.value)}
                    <button onClick={handleApplyFilters}>Apply Filters</button>
                </div>
            )}
        </div>
    );
};

export default Filter;
