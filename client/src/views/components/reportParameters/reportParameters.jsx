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
  };

  static defaultProps = {
    className: "",
    parameters: [],
  }

  renderParameter = (param, key) => {
    if (param.type === Parameters.INPUT_TEXT || param.type === Parameters.INPUT_DATE){
      return this.renderTextInput(param, key);
    }
    return null;
  }

  renderTextInput = (param, key) => {
    return <TextInput
      style={{gridColumn: "span " + param.span}}
      key={key}
      label={param.label}
      title={param.tooltip}
      onDelayedChange={() => {}}
      onEnter={() => {}}
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
