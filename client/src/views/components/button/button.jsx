import React from "react";
import "./button.scss";
import PropTypes from "prop-types";
import getTextWidth from "functions/getTextWidth.js";
import unfocus from "functions/unfocus.js";

/**
@augments {React.Component<Props, State>}
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
    className: PropTypes.string.isRequired,
    /**true if the button represents a destruction function, such as erase, delete, destroy, clear, reset, etc. */
    destructive: PropTypes.bool,
    disabled: PropTypes.bool,
    /**shown if disabled is true*/
    disabledLabel: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    /**shown for 3s after a click*/
    tempLabel: PropTypes.string,
    title: PropTypes.string,
    /**enable ghost button (transparent bg) */
    ghost: PropTypes.bool,
  };

  static defaultProps = {
    className: "",
    destructive: false,
    disabled: false,
    disabledLabel: "",
    label: "",
    onClick: () => {},
    tempLabel: "",
    title: null,
    ghost: false,
  }

  render = () => {
    let className = "button " + this.props.className;
    if (this.props.disabled || this.state.showTempLabel){
      className += " disabled";
    }
    if (this.props.destructive){
      className += " destructive ghost";
    } else if (this.props.ghost){
      className += " ghost";
    }

    let label = this.props.label;
    if (this.state.showTempLabel){
      label = this.props.tempLabel || this.props.label;
    } else if (this.props.disabled){
      label = this.props.disabledLabel || this.props.label;
    }

    let tabIndex = "0";
    if (this.props.disabled){
      tabIndex = "-1";
    }

    //this is only an approximation to reduce resizing as we change labels
    //kinda hacky, if weird things happen with widths investigate here first
    let maxWidth = Math.max(getTextWidth(this.props.label, "bold 2rem sans-serif"),
      getTextWidth(this.props.tempLabel, "bold 2rem sans-serif"),
      getTextWidth(this.props.disabledLabel, "bold 2rem sans-serif")) + 40 + "px";

    return (
      <button
        tabIndex={tabIndex}
        className={className}
        onMouseLeave={unfocus}
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
