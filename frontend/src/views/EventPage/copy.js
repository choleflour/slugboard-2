import React, { useState } from 'react';
import axios from 'axios';

const Event = () => {
  const [formData, setFormData] = useState({
    eventname: '',
    email: '',
    // Add more form fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = 'http://localhost:8080/UploadEventJson/test_uuid'; // Replace with your API endpoint

      // Convert form data to JSON
      const jsonData = JSON.stringify(formData);

      // Send JSON data to the API using Axios
      const response = await axios.post(apiUrl, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Event Name:
        <input type="text" name="eventname" value={formData.eventname} onChange={handleChange} />
      </label>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>

      {/* Add more form fields as needed */}

      <button type="submit">Submit</button>
    </form>
  );
};

export default Event;
