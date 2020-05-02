import React from "react";
import { NavLink } from "react-router-dom";
import "./parameterDocumentation.scss";
import PropTypes from "prop-types";
import * as Parameters from "constants/parameters.js";
import TextInput from "views/components/textInput/textInput";

/**
@augments {React.Component<Props, State>}
*/
export default class ParametersDocumentation extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    parameters: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: "",
    parameters: [],
  }



  render = () => {
    let className = "parameter-documentation " + this.props.className;

    return (
      <div className={className}>
        {this.props.parameters.map((param) => {
          return <div key={param.key} className="parameter">
            <div className="header-bar">
              <div className="title">{param.label} ({param.key})</div>
              <div className="type">{param.type}</div>
            </div>
            <div className="description">{param.description}</div>
            {param.validation.map((rule, index) => {
              return <div key={index} className="validation-rule">
                <div className="header">Validation rule {index}</div>
                <div>Regex: /{rule.regex}/</div>
                <div>If it matches, treat the input as {rule.result ? "valid" : "invalid"}. </div>
                {rule.message &&
                    <div>And display this message: "{rule.message}" </div>
                }
              </div>;
            })}
          </div>;
        })}

      </div>
    );
  }
}
