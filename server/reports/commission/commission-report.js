// module "commission-report"
const { Parser } = require("json2csv");


/* A handy request URLS for testing:
http://localhost:8080/reports/commission?format=csv&startdate=111&enddate=2222
*/
function handleExpressRequest(request, response) {

  //console.log("handleExpressRequest:");
  //console.log("request: " + request.baseUrl + " - " + JSON.stringify(request.query));

  // Validate input parameters
  //query string looks like: ?format=[json|csv]&startdate=[whatever]&enddate=[whatever]
  let format = request.query.format;
  if (!format) {
    format = "json";
  }
  if (!(format === "json" || format === "csv")) {
    response.send("Bad \"format]\" parameter. Must be \"json\" or \"csv\"");
    return;
  }

  let startDate = request.query.startdate;
  if (!startDate) {
    response.send("Missing \"startdate\" parameter.");
    return;
  }
  //TODO: Parse startDate from string

  let endDate = request.query.enddate;
  if (!endDate) {
    response.send("Missing \"enddate\" parameter.");
    return;
  }
  //TODO: Parse endDate from string


  // Pass validated input params to report generator
  let rptJsonRowsAsJson = [
    {
      "paramName": "Key:",
      "value": "Value:",
    },
    {
      "paramName": "format",
      "value": format,
    },
    {
      "paramName": "startDate",
      "value": startDate,
    },
    {
      "paramName": "endDate",
      "value": endDate,
    },
  ];
  //^^^ TODO: Replace this dummy data.


  // Generate output
  if (format === "csv") {
    let fields = ["paramName", "value"];
    let parser = new Parser({fields});
    let csv = parser.parse(rptJsonRowsAsJson);
    let fileName = "CommissionReport.csv";
    //TODO: As a user, I'd appreciate a more unique filename with the date range embedded
    response.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
    response.contentType("text/csv");
    response.send(csv);
  } else if (format === "json") {
    response.json(rptJsonRowsAsJson);
  }
}


module.exports = {handleExpressRequest};

