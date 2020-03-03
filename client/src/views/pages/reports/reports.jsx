import React from "react";
import { Route, Link } from "react-router-dom";
import "./reports.scss";

import AttendanceReport from "views/components/reports/attendance/attendance.jsx";
import SalesReport from "views/components/reports/sales/sales.jsx";

export default class Reports extends React.Component {
  render() {
    return (
      <div className="reports">
        <div>You are on the: reports page. </div>
        <div>Select a Report:</div>
        <nav>
          <Link className="button" to="/reports/attendance">Attendance Report</Link>
          <Link className="button" to="/reports/sales">Sales Report</Link>
        </nav>
        <Route path="/reports/attendance" component={AttendanceReport} />
        <Route path="/reports/sales" component={SalesReport} />
      </div>
    );
  }
}
