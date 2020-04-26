import express from "express";
import json2csvExports from "json2csv";
import {handleCommissionRptRequest} from "./reports/commission/commission-endpoint.js";
import {attendanceRequestHandler} from "./reports/attendance/attendance-endpoint.js";

var app = express();
const portNumber = 8080;

//this is an example of an endpoint. When the user requests the root page of the server,
//like "http://localhost", the server replies by sending a response of "Hello World".
app.get("/", function(req, response) {
  response.send("Hello world");
});

//TODO: Remove the sample endpoints? By 4/15, we should have real endpoints, so these will be useless.
//this is another endpoint. When someone requests "http://localhost/sample.csv", the server
//responds with this little csv file.
app.get("/sample.csv", function(req, res) {
  var jsonRows = [
    {
      "firstName": "Warren",
      "lastName": "Harrison",
      "workplace": "PSU",
    },
    {
      "firstName": "John",
      "lastName": "Schroeder",
      "workplace": "Amazon",
    },
    {
      "firstName": "Shannon",
      "lastName": "Gee",
      "workplace": "Ecdysiast",
    },
  ];

  var fields = ["firstName", "lastName", "workplace"];
  var parser = new json2csvExports.Parser({fields});
  var csv = parser.parse(jsonRows);
  res.contentType("text/csv");
  res.send(csv);
});

//endpoint for attendance report 
app.get("/reports/attendance", attendanceRequestHandler);

//endpoint for commission report
app.get("/reports/commission", handleCommissionRptRequest);

//start up the server, now that the endpoint handlers are installed.
app.listen(portNumber, function() {
  console.log("Mindbody report server listening at http://localhost:%s", portNumber);
});

