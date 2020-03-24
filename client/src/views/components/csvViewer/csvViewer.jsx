import React from "react";
import { NavLink } from "react-router-dom";
import "./csvViewer.scss";
import PropTypes from "prop-types";
import TextInput from "views/components/textInput/textInput.jsx";
import Button from "views/components/button/button.jsx";
import Grid from "views/components/grid/grid.jsx";

export default class CsvViewer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      headers: ["Date", "N1", "N2", "N3", "N4"],
      data: [],
      apiEndpoint: "",
    };
  }


  rowToTabbedData = async(row) => {
    return String(row) + "\n";
  }

  copyDataToClipboard = () => {
    Promise.all(this.state.data.map((row) => {
      return row.join("\t");
    }))
      .then((values) => {
        const e = document.createElement("textarea");
        e.value = values.join("\n");
        document.body.appendChild(e);
        e.select();
        document.execCommand("copy");
        document.body.removeChild(e);
      });
  }

  loadDataFromEndpoint = () => {
    let url = this.state.apiEndpoint;
    if (!url.startsWith("http") && !url.startsWith("https")){
      url = "http://" + url;
    }

    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Loaded data from API endpoint", url, data);
        this.setState({data: data.data, headers: data.headers});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render = () => {
    return (
      <main className="csv-viewer">
        <header className="controls">
          <TextInput
            label="Rest api url"
            onDelayedChange={(value) => {
              this.setState({apiEndpoint: value});
            }}
            onEnter={(value) => {
              this.setState({apiEndpoint: value}, () => {
                this.loadDataFromEndpoint();
              });
            }}/>
          <Button
            label="Fetch"
            onClick={this.loadDataFromEndpoint}
            title="Fetch CSV data from the REST endpoint"
          />
          <Button
            label="Copy"
            tempLabel="Copied"
            disabled={!(this.state.data && this.state.data.length > 0)}
            onClick={this.copyDataToClipboard}
            title="Copy the CSV data to clipboard"
          />
        </header>
        {this.state.data && this.state.data.length > 0 &&
          <Grid
            data={this.state.data}
            headers={this.state.headers}
          />
        }
      </main>
    );
  }
}
