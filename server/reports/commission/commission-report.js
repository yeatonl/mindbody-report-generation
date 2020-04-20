//module "commission-report"
import json2csvExports from "json2csv";
import {printAuthorizationKey, CommissionReport} from "../../commision.js";
import MindbodyAccess from "../../api-manager.js";

/*a handy request URLS for testing:
http://localhost:8080/reports/commission?format=csv&startdate=2020-03-01T00:00:00&enddate=2020-03-031T00:00:00
*/
export function handleCommissionRptRequest(request, response) {

  //console.log("handleCommissionRptRequest:");
  //console.log("request: " + request.baseUrl + " - " + JSON.stringify(request.query));

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
  
  let endDate = request.query.enddate;
  if (!endDate) {
    response.send("Missing \"enddate\" parameter.");
    return;
  }
  

  //pass validated input params to report generator
  let rptGenerator = new CommissionReport();
  rptGenerator.setStartDate(startDate);
  //rptGenerator.setEndDate(endDate);
  //rptGenerator.addFakeSalesDataForTesting();

  rptGenerator.generate().then((results) => {
    //console.log("CommissionReport.generate() returned this data: ");
    //console.log(JSON.stringify(results));
    // Results look like this: {"100000283":{"123456789":1.25}}
    // which I think is: {staffID: {productSold: commissionAmount, secondProduct: secondAmount}}

    //lookup staff names from the IDs returned by CommissionReport
    MindbodyAccess.getAuth()
    .then(MindbodyAccess.getStaff({StaffIds: Object.keys(results)}))
    .then(staffResponse => {
      /* The response from MindbodyAccess is currently: {"size":0,"timeout":0},
      so we have no valid StaffMembers to interact with here.
      let staffIdToNameDict = {};
      for (let staffInfo in staffResponse.StaffMembers) {
        staffIdToNameDict[staffInfo.Id] = staffInfo.FirstName + " " + staffInfo.LastName;
      }
      */

      //generate output
      if (format === "csv") {
        let csvRows = [];
        let totalCommission = 0.0;
        for (let staffId in results) {
          //the value for results[staffId] is a dict of commission amounts that we must now total
          let commission = 0.0;
          for (let item in results[staffId]) {
            commission += results[staffId][item];
          }
          csvRows.push({
            "Instructor": staffId,  // staffIdToNameDict[staffId]
            "Commission": commission,
          });
          totalCommission += commission
        }
        // Additionally, add an extra row for totals
        csvRows.push({
            "Instructor": "Total",
            "Commission": totalCommission,
        });

        let fields = ["Instructor", "Commission"];
        let parser = new json2csvExports.Parser({fields});
        let csv = parser.parse(csvRows);
        let fileName = "CommissionReport.csv";
        //todo: As a user, I'd appreciate a more unique filename with the date range embedded
        response.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
        response.contentType("text/csv");
        response.send(csv);
      } else if (format === "json") {
        response.json(results);
      }
    })
  });
}

