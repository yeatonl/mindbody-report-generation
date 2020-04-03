import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./options.scss";
import Checkbox from "views/components/checkbox/checkbox.jsx";
import * as themes from "constants/themes.js";
import * as actions from "store/actions/index.js";


export default connect((state) => {
  return {
    theme: state.settings.theme,
  };
}, null)(class Options extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
  }

  static defaultProps = {
    theme: "dark",
  }

  render = () => {
    return (
      <div className="options">
        <section>
          <div className="header">Appearance</div>
          <div className="content">
            <Checkbox checked={this.props.theme === themes.LIGHT} label="Light theme" onChange={(val) => {
              let theme = themes.DARK;
              if (val){
                theme = themes.LIGHT;
              }
              actions.setTheme(theme);
            }}/>
          </div>
        </section>
        <section>
          <div className="header">Miscellaneous</div>
          <div className="content">
            <div>Other stuff goes here</div>
          </div>
        </section>
        <section>
          <div className="header">MindBody API</div>
          <div className="content">
            <div>
              Api stuff goes here
            </div>
          </div>
        </section>
      </div>
    );
  }
});
