import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EventPage from './views/EventPage/EventPage';
import ClubPage from './views/ClubPage/ClubPage';
import BoardPage from './views/BoardPage/BoardPage';

function App() {
  return (
    <div className="App">

      {/** Everything outside the BrowserRouter tag will be rendered on every single page (ex: nav bar and footer)*/}
      <BrowserRouter>
        <Routes>
          {/** For each path we have, add a Route tag to define which element to render depending on the path. */}
          <Route path="/" element={ <EventPage/> }></Route>
          <Route path="/ClubPage" element={ <ClubPage/> }></Route>
          <Route path="/EventPage" element={ <EventPage/> }></Route>
          <Route path="/BoardPage" element={ <BoardPage/> }></Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
