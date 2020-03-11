import React from "react";
import { NavLink } from "react-router-dom";
import "./textInput.scss";
import PropTypes from "prop-types";

export default class TextInput extends React.Component {
  constructor(props){
    super(props);

    this.timeout = null;
  }

  render = () => {
    return (
      <label className="text-input">
        <input placeholder=" " onChange={(e) => {
          let value = e.target.value;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.props.onDelayedChange(value);
          }, 500);
        }}></input>
        <div className="label">URL goes here</div>
      </label>
    );
  }
}
