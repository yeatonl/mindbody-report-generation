import React from "react";
import { connect } from "react-redux";

import * as Actions from "store/actions/index.js";
import * as themes from "constants/themes.js";

import "./home.scss";


export default connect((state) => {
  return {
  };
}, null)(class Home extends React.Component {
  render = () => {
    return (
      <div className="home">
        <div>You are on the: homepage</div>
        <button className="button" onClick={() => {
          Actions.setTheme(themes.LIGHT);
        }}>Change redux data</button>
      </div>
    );
  }
});
