import React, { useState, useEffect } from 'react';
import config from '../../config';

const CheckBox = () => {
  // State to track the checked state for each checkbox
  const [checkedItems, setCheckedItems] = useState({});

  // Event handler for checkbox change
  const handleCheckboxChange = (itemName) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [itemName]: !prevCheckedItems[itemName], // Toggle the checked state for the specific item
    }));
  };

  // tags
  const checkboxItems = [
    "Arts & Crafts",
    "Food",
    "Outdoor",
    "Indoor",
    "Workshop",
    "Leisure",
  ];

  return (
    <div>
      {checkboxItems.map((item, index) => (
        <label key={index}>
          <input
            type="checkbox"
            checked={checkedItems[item]}
            onChange={() => handleCheckboxChange(item)}
          />
          {item}
        </label>
      ))}

      Display the checked items
      <p>Checked Items:{JSON.stringify(checkedItems)}</p>
    </div>
  );
};

export default CheckBox;
