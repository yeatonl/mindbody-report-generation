import express from "express";
import Reports from "./config/reports.js";
import {handleCommissionRptRequest} from "./reports/commission/commission-endpoint.js";
import {attendanceRequestHandler} from "./reports/attendance/attendance-endpoint.js";

var app = express();
const PORT = 8080;

//endpoint for attendance report
app.get("/reports/attendance", attendanceRequestHandler);

//endpoint for commission report
app.get("/reports/commission", handleCommissionRptRequest);

//endpoint for report metadata
app.get("/reports", (req, res) => {
  res.send(JSON.stringify(Reports));
});

//start up the server, now that the endpoint handlers are installed.
app.listen(PORT, function() {
  console.log("Mindbody report server listening at http://localhost:%s", PORT);
});

