import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.scss";
import {ReactComponent as HomeIcon} from "svg/icons/home.svg";
import {ReactComponent as ReportsIcon} from "svg/icons/reports.svg";
import {ReactComponent as DevIcon} from "svg/icons/dev.svg";
import {ReactComponent as OptionsIcon} from "svg/icons/options.svg";

export default class Sidebar extends React.Component {
  render = () => {
    return (
      <aside className="sidebar">
        <div className="prominent-items">
          <NavLink to="/reports" className="nav-item" activeClassName="active">
            <ReportsIcon className="icon"/>
            <span className="label">Reports</span>
          </NavLink>
          <NavLink to="/dev" className="nav-item" activeClassName="active">
            <DevIcon className="icon"/>
            <span className="label">Dev</span>
          </NavLink>
        </div>
        <NavLink to="/options" className="nav-item" activeClassName="active">
          <OptionsIcon className="icon"/>
          <span className="label">Options</span>
        </NavLink>
      </aside>
    );
  }
}
