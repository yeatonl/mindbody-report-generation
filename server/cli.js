import {getCommissionReport} from "./reports/commission/commission-endpoint.js";
import {getAttendanceReport} from "./reports/attendance/attendance-endpoint.js";
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
    choices: ["commission", "attendance"],
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

function getOptions() {
  var options = {format: argv.format};

  if (argv["end-date"]) {
    options.endDate = new Date(argv["end-date"]);
    if (isNaN(options.endDate)) {
      console.error("ERROR: invalid end date");
      return null;
    }
  } else {
    options.endDate = new Date();
  }

  if (argv["start-date"]) {
    options.startDate = argv["start-date"];
  } else if (argv["days-back"]) {
    let date = new Date();
    let daysback = argv["days-back"];
    date.setDate(options.endDate.getDate() - daysback);
    options.startDate = date;
  } else {
    let date = new Date();
    const week = 7;
    date.setDate(date.getDate() - week);
    options.startDate = date;
  }

  if (options.startDate >= options.endDate) {
    console.error("ERROR: the start date is greater than the end date");
    return null;
  }

  if (!argv.filename) {
    options.filename = argv.report + "-report." + options.format;
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
    getAttendanceReport(options.format, options.startDate, options.endDate).then((report) => {
      writeToFile(report, options);
    });
  }
}
