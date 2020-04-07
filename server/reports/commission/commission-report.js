// module "commission-report"
const { Parser } = require("json2csv");


/* A handy request URLS for testing:
http://localhost:8080/reports/commission?format=csv&startdate=111&enddate=2222
*/
function handleExpressRequest(req, res) {

  console.log("handleExpressRequest:");
  console.log("req: " + req.baseUrl + " - " + JSON.stringify(req.query));

  // Validate input parameters
  //query string looks like: ?format=[json|csv]&startdate=[whatever]&enddate=[whatever]
  let format = req.query.format;
  if (!format) {
    format = "json";
  }
  if (!(format === "json" || format === "csv")) {
    res.send("Bad \"format]\" parameter. Must be \"json\" or \"csv\"");
    return;
  }

  let startDate = req.query.startdate;
  if (!startDate) {
    res.send("Missing \"startdate\" parameter.");
    return;
  }
  //TODO: Parse startDate from string

  let endDate = req.query.enddate;
  if (!endDate) {
    res.send("Missing \"enddate\" parameter.");
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
    res.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
    res.contentType("text/csv");
    res.send(csv);
  } else if (format === "json") {
    res.json(rptJsonRowsAsJson);
  }
}


module.exports = {handleExpressRequest};

