import React from "react";
import { connect } from "react-redux";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import HomePage from "views/pages/home/home.jsx";
import ReportsPage from "views/pages/reports/reports.jsx";
import OptionsPage from "views/pages/options/options.jsx";
import DevPage from "views/pages/dev/dev.jsx";
import Sidebar from "views/components/sidebar/sidebar.jsx";

import "styles/index.scss";
import "styles/variables.scss";
import "styles/header.scss";
import "styles/scrollbar.scss";

export default connect((state) => {
  return {
    theme: state.settings.theme,
  };
}, () => {
  return {};
})(class App extends React.Component{
  static defaultProps = {
    theme: "dark",
  }

  static propTypes = {
    theme: PropTypes.string,
  }

  render(){
    return <div id="root" className={this.props.theme}>
      <HashRouter>
        <Sidebar />
        <Switch>
          <Redirect exact from="/" to="home" />
          <Route path="/home" component={HomePage} />
          <Route path="/reports" component={ReportsPage} />
          <Route path="/options" component={OptionsPage} />
          <Route path="/dev" component={DevPage} />
        </Switch>
      </HashRouter>
    </div>;
  }
});