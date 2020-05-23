import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import SecondarySidebar from "views/components/secondarySidebar/secondarySidebar.jsx";

import TestArea from "views/subPages/testArea/testArea.jsx";

import "./dev.scss";
import * as Actions from "store/actions/index.js";

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
          link: "/dev/test-area",
          label: "Test Area",
          component: TestArea,

        },
      ],
    };
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    interface: PropTypes.object.isRequired,
    devSidebarSelectedItem: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className="dev">
        <SecondarySidebar
          history={this.props.history}
          selectedItem={this.props.interface.devSidebarSelectedItem}
          onChange={(selectedItem) => {
            Actions.setInterfaceEntry("devSidebarSelectedItem", selectedItem);
          }}
          entries={this.state.reports}
          header="Developer Tools"
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
