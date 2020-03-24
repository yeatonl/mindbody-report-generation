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
    minimal: PropTypes.bool,
    className: PropTypes.string,
    title: PropTypes.string,
    onEnter: PropTypes.func,
  };

  static defaultProps = {
    label: "!!FIX ME!!",
    onDelayedChange: null,
    minimal: false,
    className: "",
    title: "",
    onEnter: null,
  }

  render = () => {
    let className = "text-input " + this.props.className;
    if (this.props.minimal){
      className += " minimal";
    }

    return (
      <label className={className} title={this.props.title}>
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
            if (this.props.onEnter){
              let value = e.target.value;
              if (e.keyCode === 13){ //enter
                clearTimeout(this.timeout);
                this.props.onEnter(value);
              }
            }
          }}
        ></input>
        <div className="label">{this.props.label}</div>
      </label>
    );
  }
}
