import React from "react";
import { NavLink } from "react-router-dom";
import "./testArea.scss";
import PropTypes from "prop-types";
import Button from "views/components/button/button.jsx";
import Checkbox from "views/components/checkbox/checkbox.jsx";
import Grid from "views/components/grid/grid.jsx";
import IconButton from "views/components/iconButton/iconButton";
import TextInput from "views/components/textInput/textInput";

export default class JsonViewer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      headers: [
        "Date",
        "longname1",
        "longname2",
        "longname3",
        "longname4",
        "longname5",
        "longname6",
        "longname7",
        "longname8",
        "longname9",
        "longname10",
      ],
      data: [
        [
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/20/20",
          "0",
          "0",
          "216",
          "4305",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/19/20",
          "0",
          "1400",
          "216",
          "4626",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/18/20",
          "20",
          "1600",
          "216",
          "4282",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/09/20",
          "15",
          "2000",
          "220",
          "4068",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/08/20",
          "0",
          "1400",
          "216.1",
          "508",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/07/20",
          "0",
          "3000",
          "216.1",
          "241",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/06/20",
          "0",
          "1500",
          "216.1",
          "4218",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/05/20",
          "0",
          "2000",
          "216.3",
          "5774",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/20/20",
          "0",
          "0",
          "216",
          "4305",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/19/20",
          "0",
          "1400",
          "216",
          "4626",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/18/20",
          "20",
          "1600",
          "216",
          "4282",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/09/20",
          "15",
          "2000",
          "220",
          "4068",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/08/20",
          "0",
          "1400",
          "216.1",
          "508",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/07/20",
          "0",
          "3000",
          "216.1",
          "241",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/06/20",
          "0",
          "1500",
          "216.1",
          "4218",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/05/20",
          "0",
          "2000",
          "216.3",
          "5774",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/20/20",
          "0",
          "0",
          "216",
          "4305",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/19/20",
          "0",
          "1400",
          "216",
          "4626",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/18/20",
          "20",
          "1600",
          "216",
          "4282",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/09/20",
          "15",
          "2000",
          "220",
          "4068",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/08/20",
          "0",
          "1400",
          "216.1",
          "508",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/07/20",
          "0",
          "3000",
          "216.1",
          "241",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/06/20",
          "0",
          "1500",
          "216.1",
          "4218",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
        [
          "02/05/20",
          "0",
          "2000",
          "216.3",
          "5774",
          "02/21/20",
          "0",
          "2800",
          "216",
          "216",
        ],
      ],

    };
  }

  sortData = (index) => {

  }

  render = () => {
    return (
      <div className="test-area">
        <div className="row">
          <Button destructive label="Delete" onClick={() => {}}/>
          <Button destructive label="No onclick"/>
          <Button label="test" />
          <Button ghost label="ghost test" />
          <Button disabled ghost label="disabled" />
        </div>
        <div className="row">
          <TextInput label="placeholder goes here"onDelayedChange={() => {}}onEnter={() => {}}/>
          <TextInput label="no onDelayedChange" onEnter={() => {}}/>
        </div>
        <div className="row">
          <TextInput label="try '123', '?', 'abc', '#', ''" validation={[
            {regex: "^[0-9]+$", result: true, message: "Good work"},
            {regex: "[A-z]", result: false, message: "Letters are prohibited"},
            {regex: "\\?", result: false, message: "Question marks are prohibited"},
            {regex: "\\#", result: false, message: "Hashtags are prohibited"},
            {regex: "^$", result: false, message: "Empty input is prohibited"},
            {regex: "^.*$", result: false, message: "Invalid input"},
          ]}/>
        </div>
        <Checkbox label="tick me" onChange={(val) => {
        }}/>
        <Checkbox label="Light theme" onChange={(val) => {
          if (val){
            document.body.classList.add("light");
            document.body.classList.remove("dark");
          } else {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
          }
        }}/>
        <Checkbox label="untouchable" disabled />
        <Grid
          data={this.state.data}
          headers={this.state.headers}
        />
      </div>
    );
  }
}
