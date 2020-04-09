const J2C = require("json2csv").parse;

function attendanceRequestHandler(request, response) {
  //endpoint URL
  //http://localhost:8080/reports/attendance?format=csv&startdate=01012020&enddate=12312020
  let format = request.query.format; //gets format value in URL query
  let startdate = request.query.startdate; //gets startdate value in URL query
  let enddate = request.query.enddate; //gets enddate value in URL query

  //TODO: Might want to use try catch blocks for error handling
  //Throws "error" if format isn't JSON or CSV
  if (!(format === "json" || format === "csv")) {
    response.send('Bad format parameter. Must be "json" or "csv"');
    return;
  }
  //Throws "error" if startDate DNE
  if (!startdate) {
    response.send('Missing "startdate" parameter.');
    return;
  }
  //Throws "error" if endDate DNE
  if (!enddate) {
    response.send('Missing "enddate" parameter.');
    return;
  }

  let dummyData = [
    {
      paramName: "format",
      value: format,
    },
    {
      paramName: "startDate",
      value: startdate,
    },
    {
      paramName: "endDate",
      value: enddate,
    },
  ];

  if (format === "csv") {
    const csv = J2C(dummyData, {fields: ["paramName", "value"]});
    //let fileName = "CommissionReport.csv";
    //res.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
    //res.contentType("text/csv");
    response.send(csv);
  } else {
    response.json(dummyData);
  }
}
module.exports = {attendanceRequestHandler};
