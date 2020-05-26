import express from "express";
import cors from "cors";
import Reports from "./config/reports.js";
import {handleCommissionRptRequest} from "./reports/commission/commission-endpoint.js";
import {attendanceRequestHandler} from "./reports/attendance/attendance-endpoint.js";
import * as basic from "./reports/basic/basic-endpoint.js";

const API_PORT = 8080;
const WEB_PORT = 4000;


const apiServer = express();
const PORT = 8080;

//endpoint for attendance report
apiServer.get("/reports/attendance", cors(), attendanceRequestHandler);

//endpoint for commission report
apiServer.get("/reports/commission", cors(), handleCommissionRptRequest);

//endpoints for unprocessed data
apiServer.get("/reports/classes", cors(), basic.classesRequestHandler);
apiServer.get("/reports/sales", cors(), basic.salesRequestHandler);
apiServer.get("/reports/staff", cors(), basic.staffRequestHandler);
apiServer.get("/reports/locations", cors(), basic.locationsRequestHandler);
apiServer.get("/reports/resources", cors(), basic.resourcesRequestHandler);
apiServer.get("/reports/programs", cors(), basic.programsRequestHandler);

//endpoint for report metadata
apiServer.get("/reports", cors(), (req, res) => {
  res.send(JSON.stringify(Reports));
});

//start up the server, now that the endpoint handlers are installed.
apiServer.listen(API_PORT, function() {
  console.log("MindBody Onion API server listening at http://localhost:%s", API_PORT);
});


const webServer = express();
webServer.use(express.static("build"))

//start up the server, now that the endpoint handlers are installed.
webServer.listen(WEB_PORT, function() {
  console.log("MindBody Onion web server listening at http://localhost:%s", WEB_PORT);
});

