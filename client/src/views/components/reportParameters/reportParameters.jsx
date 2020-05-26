import React from "react";
import { NavLink } from "react-router-dom";
import "./reportParameters.scss";
import PropTypes from "prop-types";
import * as Parameters from "constants/parameters.js";
import TextInput from "views/components/textInput/textInput";

/**
@augments {React.Component<Props, State>}
*/
export default class ReportParameters extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    parameters: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: "",
    parameters: [],
    onChange: () => {},
  }

  renderParameter = (param, index) => {
    if (param.type === Parameters.INPUT_TEXT || param.type === Parameters.INPUT_DATE){
      return this.renderTextInput(param, index);
    }
    return null;
  }

  renderTextInput = (param, index) => {
    return <TextInput
      style={{gridColumn: "span " + param.span}}
      key={index}
      label={param.label}
      placeholder={param.placeholder}
      title={param.tooltip}
      onDelayedChange={(value) => {
        this.props.onChange(param.key, value);
      }}
      validation={param.validation}
      onEnter={() => {}}
      initial={param.initial}
    />;
  }

  render = () => {
    let className = "report-parameters " + this.props.className;

    return (
      <div className={className}>
        {this.props.parameters.map((param, index) => {
          return this.renderParameter(param, index);
        })}

      </div>
    );
  }
}
