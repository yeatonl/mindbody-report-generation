import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import store from "store/store.js";
import {Provider } from "react-redux";

import HomePage from "views/pages/home/home.jsx";
import ReportsPage from "views/pages/reports/reports.jsx";
import OptionsPage from "views/pages/options/options.jsx";
import DevPage from "views/pages/dev/dev.jsx";
import Sidebar from "views/components/sidebar/sidebar.jsx";

import "styles/index.scss";
import "styles/variables.scss";
import "styles/header.scss";
import "styles/scrollbar.scss";


ReactDOM.render(<Provider store={store}>
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
</Provider>, document.getElementById("root"));
