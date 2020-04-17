import React from "react";
import "./textInput.scss";
import PropTypes from "prop-types";

/**
@augments {React.Component<Props, State>}
*/
export default class TextInput extends React.Component {
  constructor(props){
    super(props);

    this.timeout = null;
  }

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    /**if true, disable hover/focus/active and only show bottom border */
    minimal: PropTypes.bool,
    /**called after the user stops typing with the current value */
    onDelayedChange: PropTypes.func,
    /**called when the users presses enter */
    onEnter: PropTypes.func,
    title: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: "",
    label: "!!FIX ME!!",
    minimal: false,
    onDelayedChange: () => {},
    onEnter: null,
    title: "",
    style: {},
  }

  render = () => {
    let className = "text-input " + this.props.className;
    if (this.props.minimal){
      className += " minimal";
    }

    return (
      <label className={className} title={this.props.title} style={this.props.style}>
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
