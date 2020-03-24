import React from "react";
import "./grid.scss";
import PropTypes from "prop-types";
import TextInput from "views/components/textInput/textInput.jsx";
import IconButton from "views/components/iconButton/iconButton.jsx";
import {ReactComponent as SortIcon} from "svg/icons/sort.svg";


/*
props:
-headers: array of strings representing the headers
-data: 2D array of body data. each array is a row. each cell is a string
-sort: a function called when the user sorts a column. called with the index of the column to sort by
-className
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
    headers: PropTypes.array,
    data: PropTypes.array, //2d array
    sort: PropTypes.func,
    filter: PropTypes.func,
  };

  static defaultProps = {
    className: "",
    headers: [],
    data: [],
    sort: null,
    filter: null,
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
        return element[key].match(value);
      });
    }

    return (
      <div className={"grid " + this.props.className}>
        <div className="row header" style={subGridHeaderStyle}>
          {this.props.headers.map((cell, cellIndex) => {
            return <div key={cellIndex} className="cell">
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
                title="Filter data (regex)"
              />
              <IconButton
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
        <div className="body" style={subGridStyle}>
          {data.map((row, rowIndex) => {
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
    );
  }
}
