import React from "react";
import { connect } from "react-redux";

import store from "store/store.js";
import * as Actions from "store/actions/index.js";

import "./home.scss";


export default connect((state) => {
  return {
    example: state.example,
  };
}, () => {
  return {};
})(class Home extends React.Component {
  render = () => {
    return (
      <div className="home">
        <div>You are on the: homepage</div>
        <div>Redux data: {String(this.props.example.exampleField)}</div>
        <button className="button" onClick={() => {
          store.dispatch(Actions.EXAMPLE_ACTION());
        }}>Change redux data</button>
      </div>
    );
  }
});
