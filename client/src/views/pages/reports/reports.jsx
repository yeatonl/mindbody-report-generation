import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink, Route } from "react-router-dom";
import "./reports.scss";
import * as Actions from "store/actions/index.js";

import Report from "views/subPages/report/report.jsx";
import SecondarySidebar from "views/components/secondarySidebar/secondarySidebar.jsx";

export default connect((state) => {
  return {
    interface: state.interface,
    reports: state.reports,
  };
}, null)(class Reports extends React.Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    interface: PropTypes.shape({
      reportsSidebarSelectedItem: PropTypes.number.isRequired,
    }),
    reports: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    let sidebarEntries = [];

    for (const [key, value] of Object.entries(this.props.reports)){
      sidebarEntries.push({
        label: value.label,
        link: value.localLink,
      });
    }

    return (
      <div className="reports">
        <SecondarySidebar
          selectedItem={this.props.interface.reportsSidebarSelectedItem}
          onChange={(selectedItem) => {
            Actions.setInterfaceEntry("reportsSidebarSelectedItem", selectedItem);
          }}
          history={this.props.history}
          entries={sidebarEntries}
          header="Available Reports"
        />
        {Object.values(this.props.reports).map((report, reportIndex) => {
          return (
            <Route key={reportIndex} path={report.localLink}><Report report={report}/></Route>
          );
        })}

      </div>
    );
  }
});
