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
        "N1",
        "N2",
        "N3",
        "NN4",
      ],
      data: [
        [
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
        ],
        [
          "02/19/20",
          "0",
          "1400",
          "216",
          "4626",
        ],
        [
          "02/18/20",
          "20",
          "1600",
          "216",
          "4282",
        ],
        [
          "02/09/20",
          "15",
          "2000",
          "220",
          "4068",
        ],
        [
          "02/08/20",
          "0",
          "1400",
          "216.1",
          "508",
        ],
        [
          "02/07/20",
          "0",
          "3000",
          "216.1",
          "241",
        ],
        [
          "02/06/20",
          "0",
          "1500",
          "216.1",
          "4218",
        ],
        [
          "02/05/20",
          "0",
          "2000",
          "216.3",
          "5774",
        ],
        [
          "02/04/20",
          "10",
          "2500",
          "217.4",
          "6591",
        ],
        [
          "02/03/20",
          "17",
          "2000",
          "228.7",
          "7742",
        ],
        [
          "02/02/20",
          "15",
          "3500",
          "218",
          "3866",
        ],
        [
          "02/01/20",
          "15",
          "1170",
          "218",
          "415",
        ],
        [
          "01/31/20",
          "0",
          "1400",
          "218",
          "4199",
        ],
        [
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
        ],
        [
          "02/19/20",
          "0",
          "1400",
          "216",
          "4626",
        ],
        [
          "02/18/20",
          "20",
          "1600",
          "216",
          "4282",
        ],
        [
          "02/17/20",
          "0",
          "2000",
          "216",
          "4626",
        ],
        [
          "02/16/20",
          "19",
          "3400",
          "220.7",
          "3900",
        ],
        [
          "02/15/20",
          "0",
          "2000",
          "217.4",
          "535",
        ],
        [
          "02/14/20",
          "0",
          "2000",
          "217.4",
          "278",
        ],
        [
          "02/13/20",
          "15",
          "1600",
          "217.4",
          "7191",
        ],
        [
          "02/12/20",
          "0",
          "2000",
          "218.9",
          "4456",
        ],
        [
          "02/11/20",
          "15",
          "2000",
          "218.9",
          "7692",
        ],
        [
          "02/10/20",
          "0",
          "2000",
          "218.9",
          "4241",
        ],
        [
          "02/09/20",
          "15",
          "2000",
          "220",
          "4068",
        ],
        [
          "02/08/20",
          "0",
          "1400",
          "216.1",
          "508",
        ],
        [
          "02/07/20",
          "0",
          "3000",
          "216.1",
          "241",
        ],
        [
          "02/06/20",
          "0",
          "1500",
          "216.1",
          "4218",
        ],
        [
          "02/05/20",
          "0",
          "2000",
          "216.3",
          "5774",
        ],
        [
          "02/04/20",
          "10",
          "2500",
          "217.4",
          "6591",
        ],
        [
          "02/03/20",
          "17",
          "2000",
          "228.7",
          "7742",
        ],
        [
          "02/02/20",
          "15",
          "3500",
          "218",
          "3866",
        ],
        [
          "02/01/20",
          "15",
          "1170",
          "218",
          "415",
        ],
        [
          "01/31/20",
          "0",
          "1400",
          "218",
          "4199",
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
        </div>
        <TextInput label="placeholder goes here"onDelayedChange={() => {}}onEnter={() => {}}/>
        <Checkbox label="tick me" onChange={(val) => {
          console.log("Checkbox changed", val);
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
