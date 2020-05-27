import {getCommissionReport} from "./reports/commission/commission-endpoint.js";
import {getAttendanceReport} from "./reports/attendance/attendance-endpoint.js";
import * as basic from "./reports/basic/basic-endpoint.js";
import yargs from "yargs";
import fs from "fs";

//some sample commands for testing:
//node cli -r commission 
//node cli -r attendance --days-back 30
//node cli -r commission --start-date 2020-02-01
//node cli -r commission -s 2020-02-01 --end-date 2020-04-30T21:58:52.206Z

const argv = yargs
  .option("start-date", {
    alias: "s",
    description: "Set the start date of the report",
    type: "string",
  })
  .option("end-date", {
    alias: "e",
    description: "Set the end date of the report",
    type: "string",
  })
  .option("days-back", {
    alias: "b",
    description: "An alternative to start-date",
    type: "number",
  })
  .option("report", {
    alias: "r",
    description: "Set the report type",
    choices: [
      "commission", "attendance", "classes", "sales", "staff", "locations",
      "resources", "programs"
    ],
  })
  .option("format", {
    alias: "f",
    description: "Set the report format",
    choices: ["csv", "json"],
    default: "csv",
  })
  .option("filename", {
    alias: "n",
    description: "Set file name of the report",
    type: "string",
  })
  .conflicts("start-date", "days-back")
  .demandOption(["report"], "No report selected")
  .help()
  .alias("help", "h")
  .argv;

function writeToFile(report, options) {
  console.log("Writing " + options.filename);
  fs.writeFile(options.filename, report, (error) => {
    if (error) {
      console.error(error);
    }
  });
}

//construct a date for in filenames
function getFileDate(date) {
  if (typeof date === "string") {
    return date;
  } else {
    return date.toISOString().substring(0, 10);
  }
}

function getOptions() {
  var options = {format: argv.format};

  if (argv["end-date"]) {
    options.enddate = new Date(argv["end-date"]);
    if (isNaN(options.enddate)) {
      console.error("ERROR: invalid end date");
      return null;
    }
  } else {
    options.enddate = new Date();
  }

  if (argv["start-date"]) {
    options.startdate = new Date(argv["start-date"]);
    if (isNaN(options.startdate)) {
      console.error("ERROR: invalid start date");
      return null;
    }
  } else if (argv["days-back"]) {
    let date = new Date();
    let daysback = argv["days-back"];
    date.setDate(options.enddate.getDate() - daysback);
    options.startdate = date;
  } else {
    let date = new Date();
    const week = 7;
    date.setDate(date.getDate() - week);
    options.startdate = date;
  }

  if (options.startdate >= options.enddate) {
    console.error("ERROR: the start date is greater than the end date");
    return null;
  }

  if (!argv.filename) {
    //this default filename looks like:  attendance 2020-04-22 - 2020-05-12.csv
    let start = getFileDate(options.startdate);
    let end = getFileDate(options.enddate);
    let name = argv.report + " " + start + " - " + end + "." + options.format;
    options.filename = name;
  }

  return options;
}

var options = getOptions();
if (options) {
  console.log(options);
  if (argv.report === "commission") {
    getCommissionReport(options).then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "attendance") {
    let promise = getAttendanceReport(
      options.format, options.startdate, options.enddate);
    promise.then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "classes") {
    basic.getClasses(options).then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "sales") {
    basic.getSales(options).then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "staff") {
    basic.getStaff(options).then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "locations") {
    basic.getLocations(options).then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "resources") {
    basic.getResources(options).then((report) => {
      writeToFile(report, options);
    });
  } else if (argv.report === "programs") {
    basic.getPrograms(options).then((report) => {
      writeToFile(report, options);
    });
  }
}
