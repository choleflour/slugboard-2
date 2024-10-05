import React, { useState } from 'react';

const ImageUpload = ({selectedImage, setSelectedImage, uuid}) => {
//   const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    // console.log("HANDLE IMAGE CHANGE CALLED!");
    const file = e.target.files[0];
    setSelectedImage(file);
  
    // handleImageUpload();
  };
// upload
  // const handleImageUpload = () => {
  //   // You can handle the image upload logic here
  //   if (selectedImage) {
  //     console.log('Selected Image:', selectedImage);
  //     // Perform actions like uploading to a server, etc.
  //   } else {
  //     console.log('No image selected');
  //   }
  // };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* <button onClick={handleImageUpload}>Upload Image</button> */}
    </div>
    // <input value={state[selectedImage]} onChange={setState()}/>
  );
};

export default ImageUpload;
