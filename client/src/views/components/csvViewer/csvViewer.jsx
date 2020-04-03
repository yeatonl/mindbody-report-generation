import React from "react";
import { NavLink } from "react-router-dom";
import "./csvViewer.scss";
import PropTypes from "prop-types";
import TextInput from "views/components/textInput/textInput.jsx";
import Button from "views/components/button/button.jsx";

export default class CsvViewer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      headers: ["Date", "N1", "N2", "N3", "N4"],
      data: [],
      apiEndpoint: "",
    };
  }

  sortData = (index) => {
    this.setState({data: this.state.data.sort((first, second) => {
      return String(first[index]).localeCompare(String(second[index]));
    })});
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
    //make the grid have as many columns as implicitly defined in our data
    //each element in the grid is actually a row containing a bunch of cells
    //this lets us color alternate rows differently, but we need each row to span all available cells
    let subGridStyle = {
      gridColumn: `span ${this.state.headers.length}`,
      gridTemplateColumns: `repeat(${this.state.headers.length}, 1fr)`,
    };

    let subGridHeaderStyle = {
      gridColumn: `span ${this.state.headers.length}`,
      gridTemplateColumns: `repeat(${this.state.headers.length}, 1fr)`,
    };

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
          <div className="grid">
            <div className="row header" style={subGridHeaderStyle}>
              {this.state.headers.map((cell, cellIndex) => {
                return <div
                  title="Click to sort"
                  className="cell"
                  key={cellIndex}
                  onClick={() => {
                    this.sortData(cellIndex);
                  }}
                >{cell}</div>;
              })}
            </div>
            <div className="body" style={subGridStyle}>
              {this.state.data.map((row, rowIndex) => {
                return (
                  <div className="row" key={rowIndex} style={subGridStyle}>
                    {row.map((cell, cellIndex) => {
                      return (
                        <div className="cell" key={String(rowIndex) + String(cellIndex)}>{cell}</div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        }
      </main>
    );
  }
}
