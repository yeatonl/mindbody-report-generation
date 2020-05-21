import MindbodyAccess from "../../api-manager.js";
import J2C from "json2csv";

const MINSTUDENTS_DEFAULT = 4;

// reformats date to mm/dd/yyyy format and returns it as a string
function reformatDate(date) {
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0");
  let yyyy = date.getFullYear();
  let reformattedDate = mm + "/" + dd + "/" + yyyy;
  return reformattedDate;
}

// takes a classID as a parameter and 
// returns the number of students that attended that class
function getNumberAttended(classID) {
  return new Promise((resolve, reject) => {
    MindbodyAccess.getClassVisits({ClassID: classID})
      .then((classVisits) => {
        let numberAttended = Object.keys(classVisits.Class.Visits).length;
        if(numberAttended >= 0)
          resolve(numberAttended);
        else
          reject("getNumberAttended Rejected. numberAttended var is empty");
      })
      .catch((error) => {
        console.log("In getNumberAttended Catch block. Could not find class!\n", error);
        console.log("Filling attendance with dummy value of 9999\n");

        // resolving in the catch block because of ENOTFOUND error
        // this makes it so the report doesn't crash when this error appears.
        resolve(9999);
      })
    })

}

//the front-end and json2csv expect different JSON formats
function formatJSON(data, headers) {
  let results = [];
  for (let i = 0; i < data.length; i++) {
    var result = {};
    for (let j = 0; j < headers.length; j++) {
      result[headers[j]] = data[i][j];
    }
    results.push(result);
  }
  return results;
}

export function getAttendanceReport(format, startdate, enddate, minStudents) {
  //access Mindbody Endpoints
  return MindbodyAccess.getAuth()
    .then((value) => {
      MindbodyAccess.authToken = value.AccessToken;
      return MindbodyAccess.getClasses({
        StartDateTime: startdate,
        EndDateTime: enddate,
      });
    })
    //gets all classes from "Classes" endpoint
    .then((classes) => {
      let attendanceReport = {
        data: [],
        headers: ["classId", "classTitle", "classStartTime", "capacity", "registered", "attended"],
      };
      let allNumberAttendedPromises = [];
      let numberOfClasses = Object.keys(classes.Classes).length;

      //iterates through every class in classes
      for (let i = 0; i < numberOfClasses; ++i) {
        let classId = classes.Classes[i].Id;

        // adds attendance parameter to classData
        let numberAttendedPromise = getNumberAttended(classId)
          .then((numberAttended) => {
            if (numberAttended >= minStudents) {
              attendanceReport.data.push([
                classId,
                classes.Classes[i].ClassDescription.Name,
                classes.Classes[i].StartDateTime,
                classes.Classes[i].MaxCapacity, 
                classes.Classes[i].TotalBooked, 
                numberAttended
              ]); // pushes current class's data to attendanceReport
            }
          })
          .catch((err) => {
            console.log("ERROR! ", err);
          });
        allNumberAttendedPromises.push(numberAttendedPromise);
      }

      //resolves all, allNumberAttendedPromises then outputs attendance report to endpoint as CSV or JSON
      return Promise.all(allNumberAttendedPromises)
        .then(() => {
          if (format === "csv") {
            let parser = new J2C.Parser(attendanceReport.headers);
            let dataForParser = attendanceReport.data.map((row) => {
              let rowForParser = {};
              for (let i = 0; i < attendanceReport.headers.length; i ++) {
                rowForParser[attendanceReport.headers[i]] = row[i];
              }
              return rowForParser;
            });
            return parser.parse(formatJSON(attendanceReport.data, attendanceReport.headers));
          }
          return attendanceReport;
        });
    });
}

//gets attendance data from mindbody endpoints and outputs it as .csv or JSON to our endpoint
//endpoint URL example
//http://localhost:8080/reports/attendance?format=csv&startdate=01/01/2020&enddate=12/31/2020&minStudents=4
export function attendanceRequestHandler(request, response) {
  let format = request.query.format; //gets format value in URL query
  let startdate = request.query.startdate; //gets startdate value in URL query
  let enddate = request.query.enddate; //gets enddate value in URL query
  let minStudents = Number(request.query.minStudents);

  //error handling
  //"throws error" if format isn't JSON or CSV
  if (!(format === "json" || format === "csv")) {
    response.send("Bad format parameter. Must be \"json\" or \"csv\"");
    return;
  }
  //sets startdate to 2 weeks prior to current day if field is NULL
  if (!startdate) {
    let today = new Date();
    today.setDate(today.getDate()-14);
    let twoWeeksPrior = reformatDate(today);
    startdate = twoWeeksPrior;
  }
  //sets enddate to current day if field is NULL
  if (!enddate) {
    let today = new Date();
    enddate = reformatDate(today);
  }
  //sets minStudents to MINSTUDENTS_DEFAULT if field is NaN
  if (Number.isNaN(minStudents)) {
    minStudents = MINSTUDENTS_DEFAULT;
  }

  getAttendanceReport(format, startdate, enddate, minStudents)
    .then((report) => {
      if (format == "csv") {
        let fileName = "Attendance " + startdate + "-" + enddate + ".csv";
        //todo: we should choose a filename that includes helpful info like the date range
        response.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
        response.contentType("text/csv");
        response.send(report);
      } else {
        response.json(report);
      }
    })
    .catch((m) => {
      //todo: make an error message consistent with commission report
      console.log("Error! In attendance-report-endpoint catch block.");
      console.log(m);
    });
}