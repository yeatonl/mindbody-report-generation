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
    /**must be an SVG ReactComponent. ```import {ReactComponent as YOUR-NAME-HERE} from "PATH/TO/ICON.svg"```*/
    icon: PropTypes.instanceOf(Object).isRequired,
    onClick: PropTypes.func,
    title: PropTypes.string,
    /**if true, will be small and have padding */
    inline: PropTypes.bool,
  };

  static defaultProps = {
    className: "",
    icon: null,
    onClick: () => {},
    title: "",
    inline: false,
  }

  render = () => {
    let className = "icon-button " + this.props.className;
    if (this.props.inline){
      className += " inline";
    }

    return (
      <button
        className={className}
        onMouseLeave={unfocus}
        onClick={() => {
          this.props.onClick();
        }}
        title={this.props.title}
      >
        {this.props.icon}
      </button>
    );
  }
}
