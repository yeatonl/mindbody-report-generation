import express from "express";
import cors from "cors";
import Reports from "./config/reports.js";
import {handleCommissionRptRequest} from "./reports/commission/commission-endpoint.js";
import {attendanceRequestHandler} from "./reports/attendance/attendance-endpoint.js";
import * as basic from "./reports/basic/basic-endpoint.js";

var app = express();
const PORT = 8080;

//endpoint for attendance report
app.get("/reports/attendance", cors(), attendanceRequestHandler);

//endpoint for commission report
app.get("/reports/commission", cors(), handleCommissionRptRequest);

//endpoints for unprocessed data
app.get("/reports/classes", cors(), basic.classesRequestHandler);
app.get("/reports/sales", cors(), basic.salesRequestHandler);
app.get("/reports/staff", cors(), basic.staffRequestHandler);
app.get("/reports/locations", cors(), basic.locationsRequestHandler);
app.get("/reports/resources", cors(), basic.resourcesRequestHandler);
app.get("/reports/programs", cors(), basic.programsRequestHandler);

//endpoint for report metadata
app.get("/reports", cors(), (req, res) => {
  res.send(JSON.stringify(Reports));
});

//start up the server, now that the endpoint handlers are installed.
app.listen(PORT, function() {
  console.log("Mindbody report server listening at http://localhost:%s", PORT);
});

