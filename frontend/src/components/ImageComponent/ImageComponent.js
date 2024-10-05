import React, { useState, useEffect } from 'react';

import config from '../../config';

const apiUrl = config.apiUrl;

// const ImageComponent = React.memo(({ imageUrl }) => (
//   <img src={imageUrl} alt="Your Image" />
// ));


const ImageComponent = React.memo(({uuid, flyer}) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log(`uuid is ${uuid}`);
        console.log(uuid);
        console.log("use effect called in ImageComponent");
        let url;
        if (flyer.startsWith("gs")) {
          const response = await fetch(`http://localhost:8080/FetchImage/${uuid}`);
          const blob = await response.blob();
          // Create a data URL from the blob
          url = URL.createObjectURL(blob);
        } else {
          url = flyer;
        }

        // if statement end
        setImageUrl(url);

      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    // Fetch the image when the component mounts
    fetchImage();
    console.log("hi image");
    console.log(imageUrl);
  }, []);

  return (
    <div className='ImageComponent-div'>
      {imageUrl && <img src={imageUrl} alt="GCS Image" style={{ maxWidth: '100%' }} />}
    </div>
  );
});

export default ImageComponent;
