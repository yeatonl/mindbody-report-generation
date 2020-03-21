import React from "react";
import { NavLink } from "react-router-dom";
import "./testArea.scss";
import PropTypes from "prop-types";
import Button from "views/components/button/button.jsx";
import Checkbox from "views/components/checkbox/checkbox.jsx";

export default class JsonViewer extends React.Component {
  render = () => {
    return (
      <div className="test-area">
        <Button destructive label="Delete" onClick={() => {}}/>
        <Button destructive label="Delete" onClick={() => {}}/>
        <Button destructive label="Delete" onClick={() => {}}/>
        <Button destructive label="Delete" onClick={() => {}}/>
        <Checkbox label="tick me" onChange={(val) => {
          console.log("Checkbox changed", val);
        }}/>
        <Checkbox label="untouchable" disabled />
      </div>
    );
  }
}
