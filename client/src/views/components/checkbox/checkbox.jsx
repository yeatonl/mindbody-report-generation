import React from "react";
import { NavLink } from "react-router-dom";
import "./checkbox.scss";
import PropTypes from "prop-types";
import getTextWidth from "functions/getTextWidth.js";
import {ReactComponent as CheckmarkIcon} from "svg/icons/checkmark.svg";
import unfocus from "functions/unfocus.js";

/**
@augments {React.Component<Props, State>}
*/
export default class Checkbox extends React.Component {
  constructor(props){
    super(props);

    this.timeout = null;

    this.state = {
      showTempLabel: false,
    };
  }

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
  };

  static defaultProps = {
    className: "",
    disabled: false,
    label: "",
    onChange: null,
    checked: false,
  }

  render = () => {
    let className = "checkbox " + this.props.className;
    if (this.props.disabled || this.state.showTempLabel){
      className += " disabled";
    }

    return (
      <label className={className} tabIndex="0" onClick={unfocus}>
        <input type="checkbox" checked={this.props.checked} onChange={(e) => {
          if (this.props.onChange){
            this.props.onChange(e.target.checked);
          }
        }}/>
        <span className="fake-checkbox">
          <CheckmarkIcon className="checkmark"/>
        </span>
        <span className="label">{this.props.label}</span>
      </label>
    );
  }
}
