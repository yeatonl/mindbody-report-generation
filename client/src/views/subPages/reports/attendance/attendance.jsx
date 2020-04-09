import React from "react";
import { connect } from "react-redux";
import "./attendance.scss";
import Grid from "views/components/grid/grid.jsx";
import PropTypes from "prop-types";
import TextInput from "views/components/textInput/textInput.jsx";
import Button from "views/components/button/button.jsx";
import ReportParameters from "views/components/reportParameters/reportParameters.jsx";
import * as Urls from "constants/urls.js";
import * as Reports from "constants/reports.js";
import * as Actions from "store/actions/index.js";
import { fetchReportData } from "store/actions";
import copyToClipboard from "functions/copyToClipboard";


export default connect((state) => {
  return {
    data: state.reports[Reports.ATTENDANCE]?.data,
    headers: state.reports[Reports.ATTENDANCE]?.headers,
    parameters: state.reports[Reports.ATTENDANCE]?.parameters,
  };
}, null)(class AttendanceReport extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    headers: PropTypes.array,
    parameters: PropTypes.array,
  }

  static defaultProps = {
    data: [],
    headers: [],
    parameters: [],
  }

  constructor(props){
    super(props);

    this.state = {
      startDate: "",
      endDate: "",
    };
  }

  componentDidMount = () => {
    Actions.fetchReportParameters(Urls.ATTENDANCE_REPORT_URL_PARAMETERS, Reports.ATTENDANCE);
  }

  copyDataToClipboard = () => {
    Promise.all(this.props.data.map((row) => {
      return row.join("\t");
    }))
      .then((values) => {
        copyToClipboard(values.join("\n"));
      });
  }

  downloadData = () => {
    //tbd
  }

  loadDataFromEndpoint = () => {
    Actions.fetchReportData(Urls.ATTENDANCE_REPORT_URL_JSON, Reports.ATTENDANCE);
  }

  render = () => {
    return (
      <main className="attendance-report">
        <header>
          <ReportParameters parameters={this.props.parameters} />
          <div className="buttons">
            <Button
              label="Fetch"
              onClick={this.loadDataFromEndpoint}
              title="Fetch CSV data from the REST endpoint"
            />
            <Button
              ghost
              label="Copy"
              tempLabel="Copied"
              disabled={!(this.props.data && this.props.data.length > 0)}
              onClick={this.copyDataToClipboard}
              title="Copy the CSV data to clipboard"
            />
            <Button
              ghost
              label="Download"
              tempLabel="Downloaded"
              disabled={!(this.props.data && this.props.data.length > 0)}
              onClick={this.downloadData}
              title="Download as a CSV file"
            />
          </div>
        </header>
        {this.props.data && this.props.data.length > 0 &&
          <Grid
            data={this.props.data}
            headers={this.props.headers}
          />
        }
      </main>
    );
  }
});
