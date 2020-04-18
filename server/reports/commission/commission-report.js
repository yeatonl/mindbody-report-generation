//module "commission-report"
import json2csvExports from "json2csv";
import {printAuthorizationKey, CommissionReport} from "../../commision.js";

/*a handy request URLS for testing:
http://localhost:8080/reports/commission?format=csv&startdate=2020-03-01T00:00:00&enddate=2020-03-031T00:00:00
*/
export function handleCommissionRptRequest(request, response) {

  //console.log("handleCommissionRptRequest:");
  //console.log("request: " + request.baseUrl + " - " + JSON.stringify(request.query));
  //printAuthorizationKey("Siteowner", "apitest1234");

  //validate input parameters
  //query string looks like: ?format=[json|csv]&startdate=[whatever]&enddate=[whatever]
  let format = request.query.format;
  if (!format) {
    response.send("Missing \"startdate\" parameter.");
    return;
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
  //todo: Parse startDate from string

  let endDate = request.query.enddate;
  if (!endDate) {
    response.send("Missing \"enddate\" parameter.");
    return;
  }
  //todo: Parse endDate from string


  //pass validated input params to report generator
  let rptGenerator = new CommissionReport();
  rptGenerator.setStartDate(startDate);
  //rptGenerator.setEndDate(endDate);

  rptGenerator.generate().then((results) => {
    console.log("CommissionReport.generate() returned this data: ");
    console.log(JSON.stringify(results));
    // Results look like this: {"100000283":{"123456789":1.25}}
    // which I think is: {staffID: {productSold: commissionAmount}}
    //todo: lookup staffName from ID.
    //aggregate sale amounts for each staff entry
    //aggregate other commission amount for each staff entry

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
    //^^^ todo: Replace this dummy data.

    //generate output
    if (format === "csv") {
      let fields = ["paramName", "value"];
      let parser = new json2csvExports.Parser({fields});
      let csv = parser.parse(rptJsonRowsAsJson);
      let fileName = "CommissionReport.csv";
      //todo: As a user, I'd appreciate a more unique filename with the date range embedded
      response.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
      response.contentType("text/csv");
      response.send(csv);
    } else if (format === "json") {
      response.json(rptJsonRowsAsJson);
    }

  });
}

