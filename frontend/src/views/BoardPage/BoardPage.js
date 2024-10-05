import Flyer from './Flyer/Flyer';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import slug_logo from '../../images/slug_logo.svg';
import {Link} from 'react-router-dom';
import './BoardPage.css';


const BoardPage = () => {
  const [jsonData, setJsonData] = useState();
  // const [eventNames, setEventNames] = useState();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("inside fetch data");
        const response = await fetch('http://localhost:8080/NewAllEvents'); // Replace with your API endpoint
        const data = await response.json();
        setJsonData(data.events);
        console.log("data is ");
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // const fetchData2 = async () => {
    //   try {
    //     const response = await fetch('http://localhost:8080/AllEventNames'); // Replace with your API endpoint
    //     const data = await response.json();
    //     setEventNames(data);
    //     console.log("data2 is ");
    //     console.log(data);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
    // fetchData2();
    fetchData();
  },[]); // The empty dependency array ensures this effect runs only once after the initial render


  // const modifiedData = Object.entries(jsonData).map(([uuid, entry]) => ({
  //   uuid,
  //   ...entry
  // }));
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top py-1 py-lg-3" style={{ backgroundColor: '#003E70' }}>
        <div className="container">
          {/* Left logo */}
          <Link className="navbar-brand" to="/">
            <img src="/slug_logo.png" className="logo-img" height="100px" alt="Slug Logo"></img>
          </Link>
          {/* Middle name of the website */}
          <span className="h1 ml-2 text-light" fontFamily="Kreon">Slug Board</span>
          {/* Right button */}
          <div className="ml-auto p-5">
            <Link to="/EventPage" className="btn btn-primary" style={{ backgroundColor: '#003E70' }}>Add New Event</Link>
          </div>
        </div>
      </nav>
      

      <div className="all-flyers-div container">
        { jsonData && Object.entries(jsonData).map(([index, entry]) => (
          // <Flyer key={uuid} data={{uuid, ...entry}} />
          <Flyer className="flyer-div" key={index} uuid={entry && entry.uuid} data={entry}/>
        )) }
      </div>
      <div>
          
      </div>
      {/* Add your content for the Board component */}
    </div>
  );
};

export default BoardPage;