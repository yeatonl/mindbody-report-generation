import React from "react";
import "./iconButton.scss";
import PropTypes from "prop-types";
import unfocus from "functions/unfocus";

/**
@augments {React.Component<Props, State>}
*/
export default class IconButton extends React.Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    className: PropTypes.string,
    /**must be an SVG ReactComponent. ```import {ReactComponent as YOUR-NAME-HERE} from "SVG/FILEPATH.svg"```*/
    icon: PropTypes.instanceOf(Element).isRequired,
    onClick: PropTypes.func,
    title: PropTypes.string,
  };

  static defaultProps = {
    className: "",
    icon: null,
    onClick: () => {},
    title: "",
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
