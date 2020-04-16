import J2C from "json2csv";

//returns the current date without slashes
function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + dd + yyyy; //current date without slashes 
  return today;
}

export function attendanceRequestHandler(request, response) {
  //endpoint URL
  //http://localhost:8080/reports/attendance?format=csv&startdate=01012020&enddate=12312020
  let format = request.query.format; //gets format value in URL query
  let startdate = request.query.startdate; //gets startdate value in URL query
  let enddate = request.query.enddate; //gets enddate value in URL query

  //"Throws error" if format isn't JSON or CSV
  if (!(format === "json" || format === "csv")) {
    response.send('Bad format parameter. Must be "json" or "csv"');
    return;
  }
  //Sets startdate to current day if field is NULL
  if (!startdate) {
    startdate = getDate();
  }
  //Sets enddate to current day if field is NULL
  if (!enddate) {
    enddate = getDate();
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
    let fields = ["paramName", "value"];
    let parser = new J2C.Parser({fields});
    let csv = parser.parse(dummyData);
    response.send(csv);
  } else {
    response.json(dummyData);
  }
}
