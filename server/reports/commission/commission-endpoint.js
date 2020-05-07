//module "commission-report"
import json2csvExports from "json2csv";
import {CommissionReport} from "./commission.js";
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
    response.send("Missing \"format\" parameter.");
    return;
  }
  if (!(format === "json" || format === "csv")) {
    response.send("Bad \"format]\" parameter. Must be \"json\" or \"csv\"");
    return;
  }

  let startDate = request.query.startdate;
  if (!startDate) {
    startDate = "1/1/1";
    //response.send("Missing \"startdate\" parameter.");
    //return;
  }

  let endDate = request.query.enddate;
  if (!endDate) {
    endDate = "1/1/3000";
    //response.send("Missing \"enddate\" parameter.");
    //return;
  }


  //pass validated input params to report generator
  let rptGenerator = new CommissionReport();
  rptGenerator.setStartDate(startDate);
  //rptGenerator.setEndDate(endDate);
  //rptGenerator.addFakeSalesDataForTesting();

  var rawReportData;
  rptGenerator.generate()
    .then((reportTemp) => {
      rawReportData = reportTemp;
      console.log("CommissionReport.generate() returned this data: " + JSON.stringify(rawReportData));
      return MindbodyAccess.getAuth();
    }).then(() => {
      console.log(MindbodyAccess.auth);
      return MindbodyAccess.getStaff({StaffIds: Object.keys(rawReportData)});
    })
    .then((getStaffResponse) => {
      console.log("getStaff returned: " + JSON.stringify(getStaffResponse));

      //lookup staff names from the IDs returned by CommissionReport
      let staffIdToNameDict = {};
      staffIdToNameDict[CommissionReport.noPriorInstructorKey] = "- Sales with no prior instructor -";
      for (let staffIndex in getStaffResponse.StaffMembers) {
        let staff = getStaffResponse.StaffMembers[staffIndex];
        console.log("staffInfo: " + JSON.stringify(staff));
        staffIdToNameDict[staff.Id] = staff.FirstName + " " + staff.LastName;
      }

      //generate output
      if (format === "csv") {
        let csvRows = [];
        let totalCommission = 0.0;
        for (let staffId in rawReportData) {
          //the value for rawReportData[staffId] is a dict of commission amounts that we must now total
          let commission = 0.0;
          for (let item in rawReportData[staffId]) {
            commission += rawReportData[staffId][item];
          }
          csvRows.push({
            "Instructor": staffIdToNameDict[staffId], //staffId,
            "Commission": commission,
          });
          //if (!(staffId === CommissionReport.noPriorInstructorKey)) {
          //todo: exclude SalesWithNoPriorInstructor? The requirements aren't clear here
          //}
          totalCommission += commission;
        }
        //additionally, add an extra row for totals
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
        let headers = ["Instructor", "Commission"];
        let data = [];
  
        let totalCommission = 0;
        for (const [staffId, staff] of Object.entries(rawReportData)) {
          let commission = 0;
          for (const [key, value] of Object.entries(staff)) {
            commission += value;
            totalCommission += value;
          }
          data.push([staffIdToNameDict[staffId], commission])
        }

        data.push(["Total", totalCommission]);

        response.json({headers, data});
      }
    })
    .catch((error) => {
      //todo: generate some error message page... especially handling "exceeded 1000 requests/day" error
      console.log("Caught error in CommissionReport");
      console.log(error);
      response.send(error.toString());
    });
}

