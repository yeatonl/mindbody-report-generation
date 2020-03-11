import React from "react";
import { NavLink, Route } from "react-router-dom";
import SecondarySidebar from "views/components/secondarySidebar/secondarySidebar.jsx";
import EndpointTester from "views/components/endpointTester/endpointTester.jsx";
import "./dev.scss";

export default class Reports extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      reports: [
        {
          id: 1,
          link: "/dev/endpoint-tester",
          label: "Endpoint tester",
          component: EndpointTester,
        },
      ],
    };
  }

  render() {
    return (
      <div className="dev">
        <SecondarySidebar entries={this.state.reports} header="Developer Tools" />
        {this.state.reports.map((report) => {
          return (
            <Route key={report.id} path={report.link} component={report.component} />
          );
        })}
      </div>
    );
  }
}
