import React from "react";
import { connect } from "react-redux";
import { NavLink, Route } from "react-router-dom";
import "./reports.scss";
import * as Actions from "store/actions/index.js";

import AttendanceReport from "views/subPages/reports/attendance/attendance.jsx";
import SalesReport from "views/subPages/reports/sales/sales.jsx";
import SecondarySidebar from "views/components/secondarySidebar/secondarySidebar.jsx";

export default connect((state) => {
  return {
    interface: state.interface,
  };
}, null)(class Reports extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      reports: [
        {
          link: "/reports/sales",
          label: "Sales",
          component: SalesReport,
        },
        {
          link: "/reports/attendance",
          label: "Attendance",
          component: AttendanceReport,
        },

      ],

    };
  }

  render() {
    return (
      <div className="reports">
        <SecondarySidebar
          selectedItem={this.props.interface.reportsSidebarSelectedItem}
          onChange={(selectedItem) => {
            Actions.setInterfaceEntry("reportsSidebarSelectedItem", selectedItem);
          }}
          history={this.props.history}
          entries={this.state.reports}
          header="Available Reports"
        />
        {this.state.reports.map((report, reportIndex) => {
          return (
            <Route key={reportIndex} path={report.link} component={report.component} />
          );
        })}
      </div>
    );
  }
});
