import React from "react";
import PropTypes from "prop-types"; 
import './ClubPage.css'; // replace "Club" with your own component
import ImageComponent from "../../components/ImageComponent/ImageComponent";
import DropDown from "../../components/DropDown/DropDown";

export default class ClubPage extends React.Component { // replace "Club" with your own component
  static propTypes = { // define any props here
    name: PropTypes.string,
  };

  render() {
    return (
    <div className="ClubPage-div">
      <div>
        <ImageComponent/>
        <DropDown/>
      </div>
      <div>
        under image component
      </div>
    </div>
    );
  }
}
