import React from "react";
import { NavLink, Route } from "react-router-dom";
import "./options.scss";
import Checkbox from "views/components/checkbox/checkbox.jsx";

export default class Options extends React.Component {
  render() {
    return (
      <div className="options">
        <section>
          <div className="header">Appearance</div>
          <div className="content">
            <Checkbox label="Light theme" onChange={(val) => {
              if (val){
                document.body.classList.add("light");
                document.body.classList.remove("dark");
              } else {
                document.body.classList.remove("light");
                document.body.classList.add("dark");
              }
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
}
