import React from "react";
import ReactDOM from "react-dom";
import App from "views/app/App.jsx";
import store from "store/store.js";
import {Provider } from "react-redux";
import "styles/index.scss";
import "styles/variables.scss";
import "styles/header.scss";
import "styles/scrollbar.scss";
import "styles/fonts.scss";
import * as Actions from "store/actions/index.js";

Actions.fetchReports();

ReactDOM.render(<Provider store={store}><App/></Provider>, document.querySelector("#root"));
