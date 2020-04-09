import React from "react";
import "./grid.scss";
import PropTypes from "prop-types";
import TextInput from "views/components/textInput/textInput.jsx";
import IconButton from "views/components/iconButton/iconButton.jsx";
import {ReactComponent as SortIcon} from "svg/icons/sort.svg";

/**
@augments {React.Component<Props, State>}
*/
export default class Table extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      sortedColumn: 0,
      filters: {},
    };
  }

  static propTypes = {
    className: PropTypes.string,
    /**array of strings representing the headers*/
    headers: PropTypes.array,
    /**2D array of body data. each array is a row. each cell is a string*/
    data: PropTypes.array,
  };

  static defaultProps = {
    className: "",
    headers: [],
    data: [],
  }


  render = () => {
    //make the grid have as many columns as implicitly defined in our data
    //each element in the grid is actually a row containing a bunch of cells
    //this lets us color alternate rows differently, but we need each row to span all available cells
    let subGridStyle = {
      gridColumn: `span ${this.props.headers.length}`,
      gridTemplateColumns: `repeat(${this.props.headers.length}, 1fr)`,
    };

    let subGridHeaderStyle = {
      gridColumn: `span ${this.props.headers.length}`,
      gridTemplateColumns: `repeat(${this.props.headers.length}, 1fr)`,
    };

    let data = this.props.data.sort((first, second) => {
      return String(first[this.state.sortedColumn]).localeCompare(String(second[this.state.sortedColumn]));
    });

    for (const [key, value] of Object.entries(this.state.filters)){
      data = data.filter((element) => {
        if (value.match(/^\/.*\/$/)){ //filter is a regex
          let onlyRegex = value.slice(1).slice(0, value.length - 2); //remove the leading and trailing /
          return element[key].match(onlyRegex);
        }
        return element[key].toLowerCase().startsWith(value);
      });
    }

    return (
      <div className={"gd-grid " + this.props.className}>
        <div className="gd-row gd-header" style={subGridHeaderStyle}>
          {this.props.headers.map((cell, cellIndex) => {
            return <div key={cellIndex} className="gd-cell">
              <TextInput
                minimal
                onDelayedChange={(value) => {
                  this.setState((current) => {
                    return {filters: {
                      ...current.filters,
                      [cellIndex]: value,
                    }};
                  });
                }}
                label={cell}
                title="Filter data. Enclose string in / to activate regex mode. Ex: /somestring/"
              />
              <IconButton
                inline
                className={this.state.sortedColumn === cellIndex ? "active" : ""}
                icon={<SortIcon/>}
                onClick={() => {
                  this.setState({sortedColumn: cellIndex});
                }}
                title="Sort column"
              />
            </div>;
          })}
        </div>
        <div className="gd-body" style={subGridStyle}>
          {data.map((row, rowIndex) => {
            return (
              <div className="gd-row" key={rowIndex} style={subGridStyle}>
                {row.map((cell, cellIndex) => {
                  return (
                    <div className="gd-cell" key={String(rowIndex) + String(cellIndex)}>{cell}</div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
