import React from "react";
import { NavLink } from "react-router-dom";
import "./testArea.scss";
import PropTypes from "prop-types";
import Button from "views/components/button/button.jsx";

export default class JsonViewer extends React.Component {
  render = () => {
    return (
      <div className="test-area">
        <Button destructive label="Delete" onClick={() => {}}/>
        <Button destructive label="Delete" onClick={() => {}}/>
        <Button destructive label="Delete" onClick={() => {}}/>
        <Button destructive label="Delete" onClick={() => {}}/>
      </div>
    );
  }
}
