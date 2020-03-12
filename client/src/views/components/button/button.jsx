import React from "react";
import { NavLink } from "react-router-dom";
import "./button.scss";
import PropTypes from "prop-types";
import getTextWidth from "functions/getTextWidth.js";

/*
props:
-disabled: true if the element is disabled
-onClick: function to call on click
-className: css class to add to the button
-label: default label
-disabledLabel: label to show if disabled prop is true
-tempLabel: label to show for 3s after being clicked
*/

export default class Button extends React.Component {
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
    disabledLabel: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    tempLabel: PropTypes.string,
    title: PropTypes.string,
  };

  static defaultProps = {
    className: "",
    disabled: false,
    disabledLabel: "",
    label: "",
    onClick: null,
    tempLabel: "",
    title: null,
  }

  render = () => {
    let className = "button " + this.props.className;
    if (this.props.disabled || this.state.showTempLabel){
      className += " disabled";
    }

    let label = this.props.label;
    if (this.state.showTempLabel){
      label = this.props.tempLabel || this.props.label;
    } else if (this.props.disabled){
      label = this.props.disabledLabel || this.props.label;
    }


    //this is only an approximation to reduce resizing as we change labels
    //kinda hacky, if weird things happen with widths investigate here first
    let maxWidth = Math.max(getTextWidth(this.props.label, "bold 2rem sans-serif"),
      getTextWidth(this.props.tempLabel, "bold 2rem sans-serif"),
      getTextWidth(this.props.disabledLabel, "bold 2rem sans-serif")) + 40 + "px";

    return (
      <button
        className={className}
        onClick={(event) => {
          if (this.props.tempLabel){
            this.setState({showTempLabel: true});
            setTimeout(() => {
              this.setState({showTempLabel: false});
            }, 3000);
          }

          this.props.onClick(event);
        }}
        title={this.props.title}
        style={{
          //make the button approximately wide enough to hold the longest label
          minWidth: maxWidth,
        }}>
        {label}
      </button>
    );
  }
}
