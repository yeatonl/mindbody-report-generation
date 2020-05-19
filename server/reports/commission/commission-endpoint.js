//module "commission-report"
import json2csvExports from "json2csv";
import {CommissionReport} from "./commission.js";
import MindbodyAccess from "../../api-manager.js";

function formatStaff(response) {
  let staffIdToNameDict = {};
  staffIdToNameDict[CommissionReport.noPriorInstructorKey] = "- Sales with no prior instructor -";
  for (let staffIndex in response.StaffMembers) {
    let staff = response.StaffMembers[staffIndex];
    console.log("staffInfo: " + JSON.stringify(staff));
    staffIdToNameDict[staff.Id] = staff.FirstName + " " + staff.LastName;
  }
  return staffIdToNameDict;
}

function toCSV(rawReportData, staffIdToNameDict) {
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
  return parser.parse(csvRows);
}

/*a handy request URLS for testing:
http://localhost:8080/reports/commission?format=csv&startdate=04/29/2020&enddate=04/30/2020
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
    startDate = "05/14/2020";
    //response.send("Missing \"startdate\" parameter.");
    //return;
  }

  let endDate = request.query.enddate;
  if (!endDate) {
    endDate = "05/14/2020";
    //response.send("Missing \"enddate\" parameter.");
    //return;
  }

  //pass validated input params to report generator
  let rptGenerator = new CommissionReport();
  rptGenerator.setStartDate(startDate);
  rptGenerator.setEndDate(endDate);

  var rawReportData;
  rptGenerator.generate()
    .then((reportTemp) => {
      rawReportData = reportTemp;
      console.log("CommissionReport.generate() returned this data: " + JSON.stringify(rawReportData));
      return MindbodyAccess.getStaff({StaffIds: Object.keys(rawReportData)});
    })
    .then((staffResponse) => {
      console.log("getStaff returned: " + JSON.stringify(staffResponse));

      //lookup staff names from the IDs returned by CommissionReport
      let staffIdToNameDict = formatStaff(staffResponse);

      //generate output
      if (format === "csv") {
        let csv = toCSV(rawReportData, staffIdToNameDict);
        let fileName = "Commission " + startDate + "-" + endDate + ".csv";
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

export function getCommissionReport(options) {
  var generator = new CommissionReport();
  if (options.startDate) {
    generator.setStartDate(options.startDate);
  }
  if (options.endDate) {
    generator.setEndDate(options.endDate);
  }

  var report;
  return generator.generate().then((response) => {
    report = response;
    return MindbodyAccess.getStaff({StaffIds: Object.keys(report)});
  }).then((response) => {
    let staff = formatStaff(response);
    if (options.format === "csv") {
      report = toCSV(report, staff);
    } else {
      report = JSON.stringify(report);
    }
    return report;
  });
}
