import React from "react";
import { NavLink, Route } from "react-router-dom";
import SecondarySidebar from "views/components/secondarySidebar/secondarySidebar.jsx";
import CsvViewer from "views/components/csvViewer/csvViewer.jsx";
import JsonViewer from "views/components/jsonViewer/jsonViewer.jsx";
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
          link: "/dev/json-viewer",
          label: "JSON Viewer",
          component: JsonViewer,
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
