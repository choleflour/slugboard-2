import React from 'react';
import { useHistory } from 'react-router-dom';

const HomeButton = () => {
  const history = useHistory();

  const redirectToAbout = () => {
    // Redirect to the "/BoardPage" page
    history.push('/BoardPage');
  };

  return (
    <div>
      <h2>Slug BOARD</h2>
      <button onClick={redirectToAbout}>Go to Slug Board</button>
    </div>
  );
};

export default HomeButton;
