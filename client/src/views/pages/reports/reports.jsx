import React from "react";
import { NavLink, Route } from "react-router-dom";
import "./reports.scss";

import AttendanceReport from "views/components/reports/attendance/attendance.jsx";
import SalesReport from "views/components/reports/sales/sales.jsx";

export default class Reports extends React.Component {
  render() {
    return (
      <div className="reports">
        <aside className="available-reports-wrapper">
          <div className="available-reports">
            <div className="header">Available Reports</div>
            <NavLink className="item" activeClassName="active" to="/reports/sales">Sales</NavLink>
            <NavLink className="item" activeClassName="active" to="/reports/attendance">Attendance</NavLink>
          </div>
        </aside>

        <Route path="/reports/sales" component={SalesReport} />
        <Route path="/reports/attendance" component={AttendanceReport} />
      </div>
    );
  }
}
