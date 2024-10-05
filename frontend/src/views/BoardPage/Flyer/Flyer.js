import React from 'react';
import ImageComponent from '../../../components/ImageComponent/ImageComponent';
import config from '../../../config';
const apiUrl = config.apiUrl;
// import {Link} from 'react-router-dom';

const Flyer = ({uuid, data}) => {
    const hardcoded_json = {
        "club_or_affiliation": null,
        "date": "1",
        "eventname": "1",
        "filename": "zero waste_sustainability office_2022.png",
        "flyer": `gs://bucket/bc11f326-5258-4ae1-831d-3188969f74f1.png`,
        "location": "1",
        "social_link": null,
        "tags": [],
        "time": null,
        "type": "image/png",
        "uuid": "bc11f326-5258-4ae1-831d-3188969f74f1",
        "image_api_url": "http://localhost:3000/FetchImage/bc11f326-5258-4ae1-831d-3188969f74f1"
          
    };

    const handleButtonClick = () => {
        console.log('Button clicked!');
        // Add your logic here
      };

  return (
    <div>
      {/* <div>FLYER</div> */}
      {/* <ImageComponent uuid={hardcoded_json.uuid}/> */}
      <a href={data && data.insta && data.insta} target="_blank" rel="noopener noreferrer">
        <ImageComponent uuid={uuid} flyer={data.flyer}/>
      </a>
    </div>
  );
};

export default Flyer;