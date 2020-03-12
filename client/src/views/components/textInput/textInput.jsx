import React from "react";
import { NavLink } from "react-router-dom";
import "./textInput.scss";
import PropTypes from "prop-types";

export default class TextInput extends React.Component {
  constructor(props){
    super(props);

    this.timeout = null;
  }

  static propTypes = {
    label: PropTypes.string,
    onDelayedChange: PropTypes.func,
  };

  static defaultProps = {
    label: "!!FIX ME!!",
    onDelayedChange: null,
  }

  render = () => {
    return (
      <label className="text-input">
        <input
          placeholder=" "
          onChange={(e) => {
            let value = e.target.value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.props.onDelayedChange(value);
            }, 500);
          }}
          onKeyDown={(e) => {
            let value = e.target.value;
            if (e.keyCode === 13){ //enter
              clearTimeout(this.timeout);
              this.props.onEnter(value);
            }
          }}
        ></input>
        <div className="label">{this.props.label}</div>
      </label>
    );
  }
}
