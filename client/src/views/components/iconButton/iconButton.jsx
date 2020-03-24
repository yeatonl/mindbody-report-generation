import React from "react";
import { NavLink } from "react-router-dom";
import "./iconButton.scss";
import PropTypes from "prop-types";
import unfocus from "functions/unfocus";

export default class IconButton extends React.Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.instanceOf(Element).isRequired,
  };

  static defaultProps = {
    className: "",
    onClick: () => {},
    title: "",
    icon: null,
  }

  render = () => {
    let className = "icon-button " + this.props.className;

    return (
      <button
        className={className}
        onClick={() => {
          unfocus();
          this.props.onClick();
        }}
        title={this.props.title}
      >
        {this.props.icon}
      </button>
    );
  }
}
