import React from "react";
import { connect } from "react-redux";
import "./report.scss";
import Grid from "views/components/grid/grid.jsx";
import PropTypes from "prop-types";
import TextInput from "views/components/textInput/textInput.jsx";
import Button from "views/components/button/button.jsx";
import IconButton from "views/components/iconButton/iconButton.jsx";
import ReportParameters from "views/components/reportParameters/reportParameters.jsx";
import ParameterDocumentation from "views/components/parameterDocumentation/parameterDocumentation.jsx";
import * as Urls from "constants/urls.js";
import * as Reports from "constants/reports.js";
import * as Actions from "store/actions/index.js";
import { fetchReportData } from "store/actions";
import copyToClipboard from "functions/copyToClipboard.js";
import encodeQueryParameters from "functions/encodeQueryParameters.js";
import {ReactComponent as InfoIcon} from "svg/icons/info.svg";


export default connect((state) => {
  return {
  };
}, null)(class Report extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      parametersData: {},
      showParameterDocumentation: false,
    };

    for (const [key, value] of Object.entries(this.props.report.parameters)){
      this.state.parametersData[value.key] = value.initial;
    }
  }

  static propTypes = {
    report: PropTypes.shape({
      data: PropTypes.array.isRequired,
      headers: PropTypes.array.isRequired,
      parameters: PropTypes.array.isRequired,
      jsonEndpoint: PropTypes.string.isRequired,
      csvEndpoint: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  }

  copyDataToClipboard = () => {
    Promise.all(this.props.report.data.map(async(row) => {
      return row.join("\t");
    }))
      .then((values) => {
        copyToClipboard(values.join("\n"));
      });
  }

  downloadData = () => {
    let url = Urls.API_BASE + encodeQueryParameters(this.props.report.csvEndpoint, this.state.parametersData);
    window.open(url, "_blank");
  }

  loadDataFromEndpoint = () => {
    let url = encodeQueryParameters(this.props.report.jsonEndpoint, this.state.parametersData);
    Actions.fetchReportData(url, this.props.report.key);
  }

  render = () => {
    let data = this.props.report.data;
    let headers = this.props.report.headers;
    let parameters = this.props.report.parameters;

    return (
      <main className="report">
        <header>
          <ReportParameters parameters={parameters} onChange={(key, value) => {
            this.setState((oldState) => {
              return {
                parametersData: {...oldState.parametersData, [key]: value},
              };
            });
          }} />
          <div className="buttons">
            <Button
              label="Fetch"
              onClick={this.loadDataFromEndpoint}
              title="Fetch CSV data from the REST endpoint"
            />
            <Button
              ghost
              label="Download"
              tempLabel="Downloaded"
              onClick={this.downloadData}
              title="Download as a CSV file"
            />
            <Button
              ghost
              label="Copy"
              tempLabel="Copied"
              disabled={!(data && data.length > 0)}
              onClick={this.copyDataToClipboard}
              title="Copy the CSV data to clipboard"
            />
            <IconButton
              className={this.state.showParameterDocumentation ? "active" : ""}
              icon={<InfoIcon/>}
              onClick={() => {
                this.setState((oldState) => {
                  return {showParameterDocumentation: !oldState.showParameterDocumentation};
                });
              }}
              title="Sort column"
            />
          </div>
        </header>

        {this.state.showParameterDocumentation &&
          <ParameterDocumentation parameters={this.props.report.parameters}/>
        }
        {data && data.length > 0 &&
          <Grid
            data={data}
            headers={headers}
          />
        }
      </main>
    );
  }
});
