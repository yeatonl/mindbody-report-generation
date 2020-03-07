import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import store from "store/store.js";
import {Provider } from "react-redux";

import Home from "views/pages/home/home.jsx";
import Reports from "views/pages/reports/reports.jsx";
import Sidebar from "views/components/sidebar/sidebar.jsx";
import "styles/index.scss";
import "styles/button.scss";
import "styles/variables.scss";
import "styles/header.scss";


ReactDOM.render(<Provider store={store}>
  <HashRouter>
    <Sidebar />
    <Switch>
      <Redirect exact from="/" to="home" />
      <Route path="/home" component={Home} />
      <Route path="/reports" component={Reports} />
    </Switch>
  </HashRouter>
</Provider>, document.getElementById("root"));
