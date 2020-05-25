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

    this.state = {
      valid: null,
      message: "",
    };
  }

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    /**if true, disable hover/focus/active and only show bottom border */
    minimal: PropTypes.bool,
    /**called after the user stops typing with the current value */
    onDelayedChange: PropTypes.func,
    /**don't set to ""*/
    placeholder: PropTypes.string,
    /**called when the users presses enter */
    onEnter: PropTypes.func,
    title: PropTypes.string,
    style: PropTypes.object,
    /**a validation array containing objects representing individual test cases.
     * [{
     *  regex: ".*", //regex to test with
     *  result: true, //if the regex matched, true means valid and false means invalid
     *  message: "" //message to display if the regex matched
     * }] */
    validation: PropTypes.array,
  };

  static defaultProps = {
    className: "",
    label: "!!FIX ME!!",
    minimal: false,
    onDelayedChange: () => {},
    onEnter: null,
    placeholder: " ",
    title: "",
    style: {},
    validation: [],
  }

  validate = (value) => {
    if (this.props.validation){
      for (let i = 0; i < this.props.validation.length; i++){
        let test = this.props.validation[i];

        if (value.match(test.regex)){
          this.setState({valid: test.result, message: test.message});
          break;
        }
      }
    }
  }

  render = () => {
    let inputClassName = "text-input ";
    if (this.props.minimal){
      inputClassName += " minimal";
    }

    let wrapperClassName = "text-input-wrapper " + this.props.className;
    if (this.state.valid === true){
      wrapperClassName += " valid";
    } else if (this.state.valid === false){
      wrapperClassName += " invalid";
    }

    return (
      <div className={wrapperClassName} style={this.props.style}>
        <label className={inputClassName} title={this.props.title}>
          <input
            placeholder={this.props.placeholder}
            onChange={(e) => {
              let value = e.target.value;
              clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                this.validate(value);
                this.props.onDelayedChange(value);
              }, 500);
            }}
            onKeyDown={(e) => {
              let value = e.target.value;
              if (this.props.onEnter){
                if (e.keyCode === 13){ //enter
                  this.validate(value);
                  clearTimeout(this.timeout);
                  this.props.onEnter(value);
                }
              }
            }}

          ></input>
          <div className="label">{this.props.label}</div>
        </label>
        <div className="validation-message">{this.state.message}</div>
      </div>
    );
  }
}
