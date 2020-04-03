import React from "react";
import { NavLink, Route } from "react-router-dom";
import SecondarySidebar from "views/components/secondarySidebar/secondarySidebar.jsx";

import CsvViewer from "views/subPages/csvViewer/csvViewer.jsx";
import TestArea from "views/subPages/testArea/testArea.jsx";

import "./dev.scss";

export default class Reports extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      reports: [
        {
          link: "/dev/csv-viewer",
          label: "CSV Viewer",
          component: CsvViewer,
        },
        {
          link: "/dev/test-area",
          label: "Test Area",
          component: TestArea,

        },
      ],
    };
  }

  render() {
    return (
      <div className="dev">
        <SecondarySidebar entries={this.state.reports} header="Developer Tools" />
        {this.state.reports.map((report, reportIndex) => {
          return (
            <Route key={reportIndex} path={report.link} component={report.component} />
          );
        })}
      </div>
    );
  }
}
