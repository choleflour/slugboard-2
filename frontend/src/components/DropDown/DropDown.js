import React, { useState, useEffect } from 'react';
import config from '../../config';

const apiUrl = config.apiUrl;
console.log(apiUrl); // Log the apiUrl to ensure it's correct

const DropDown = ({options, setOptions,selectedOption, setSelectedOption}) => {
  // const [options, setOptions] = useState([]);
  // const [selectedOption, setSelectedOption] = useState(null);
  
  useEffect(() => {
    // Fetch options from the API
    const fetchOptions = async () => {
      try {
        const response = await fetch(apiUrl + '/AllClubs'); // Replace with your API endpoint
        const data = await response.json();
        setOptions(data['clubs']);
        // console.log("All Clubs: ");
        // console.log(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []); // The empty dependency array ensures that the effect runs only once after the initial render

  const handleDropdownChange = (e) => {
    const newSelectedOption = e.target.value;
    setSelectedOption(newSelectedOption);

    // Call the callback function to pass the selected option to the parent
    // onSelectedOptionChange(newSelectedOption);
  };

  return (
    <div>
      <label>
        <select value={selectedOption} onChange={handleDropdownChange}>
          <option value="">-- Select --</option>
          {options.map((club, index) => (
            <option key={index} value={club}>
              {club}
            </option>
          ))}
        </select>
      </label>

    </div>
  );
};

export default DropDown;
