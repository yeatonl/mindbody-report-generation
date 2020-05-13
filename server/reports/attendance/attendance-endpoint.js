import MindbodyAccess from "../../api-manager.js";
import J2C from "json2csv";

//returns the current date 
function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy; 
  return today;
}

// takes a date as a string in the form yyyy/mm/dd (Mindbodys default date format) and
// returns a date as a string in the form mm/dd/yyyy
function fixDateFormat(date) {
  let dateSplit = date.split(/[-.\/TU]/);
  let fixedDate = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]; 
  return fixedDate;
}

// returns true if start <= toCheck <= end
// all parameters are dates as strings in the form mm/dd/yyyy 
function isValidDate(start, toCheck, end) {
  let startDate = Date.parse(start); 
  let endDate = Date.parse(end);
  let checkDate = Date.parse(toCheck);
  return (checkDate >= startDate && checkDate <= endDate) ? true : false;
}

// takes a classID as a parameter and 
// returns the number of students that attended that class
function getNumberAttended(classID) {
  return new Promise ((resolve, reject) => {
    MindbodyAccess.getClassVisits({ClassID: classID})
      .then((classVisits) => {
        let numberAttended = Object.keys(classVisits.Class.Visits).length;
        resolve(numberAttended);
      })
    })
}

export function getAttendanceReport(format, startdate, enddate) {
  // access Mindbody Endpoints
  return MindbodyAccess.getAuth()
    .then((value) => {
      MindbodyAccess.authToken = value.AccessToken;
      return MindbodyAccess.getClasses();
    })
    // gets all classes from "Classes" endpoint
    .then((classes) => {
      let attendanceReport = {
        data: [],
        headers: ["classId", "class", "capacity", "registered", "attended"],
      };
      let allNumberAttendedPromises = [];
      let numberOfClasses = Object.keys(classes.Classes).length;

      // iterates through every class in classes
      for (let i = 0; i < numberOfClasses; ++i) {
        let classId = classes.Classes[i].Id;
        let classDate = fixDateFormat(classes.Classes[i].StartDateTime); // Mindbody StartDateTime format is yyyy/mm/dd by default

        // adds class data to attendance report if startdate <= classdate <= enddate
        if (isValidDate(startdate, classDate, enddate)) {
          // adds attendance parameter to classData
          let numberAttendedPromise = getNumberAttended(classId)
            .then((numberAttended) => {
              attendanceReport.data.push([
                classId,
                classes.Classes[i].ClassDescription.Name,
                classes.Classes[i].MaxCapacity, 
                classes.Classes[i].TotalBooked, 
                numberAttended
              ]); // pushes current class's data to attendanceReport
            })
            .catch((err) => {
              console.log("ERROR! ", err);
            });
          allNumberAttendedPromises.push(numberAttendedPromise);
        }
      }

      // resolves all, allNumberAttendedPromises then outputs attendance report to endpoint as CSV or JSON
      return Promise.all(allNumberAttendedPromises)
        .then(() => {
          if (format === "csv") {
            let fields = ["class", "capacity", "registered", "attended"];
            let parser = new J2C.Parser({ fields });
            return parser.parse(attendanceReport);
          } else {
            return attendanceReport;
          }
        })
    });
}

// gets attendance data from mindbody endpoints and outputs it as .csv or JSON to our endpoint
// endpoint URL example
// http://localhost:8080/reports/attendance?format=csv&startdate=01/01/2020&enddate=12/31/2020
export function attendanceRequestHandler(request, response) {
  let format = request.query.format; //gets format value in URL query
  let startdate = request.query.startdate; //gets startdate value in URL query
  let enddate = request.query.enddate; //gets enddate value in URL query

  // error handling
  // "throws error" if format isn't JSON or CSV
  if (!(format === "json" || format === "csv")) {
    response.send('Bad format parameter. Must be "json" or "csv"');
    return;
  }
  // sets startdate to current day if field is NULL
  if (!startdate) {
    startdate = getDate();
  }
  // sets enddate to current day if field is NULL
  if (!enddate) {
    enddate = getDate();
  }

  getAttendanceReport(format, startdate, enddate)
    .then((report) => {
      if (format == "csv") { 
        let fileName = "AttendanceReport.csv";
        //todo: we should choose a filename that includes helpful info like the date range
        response.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
        response.contentType("text/csv");  
      } else {
        response.json(report);
      }
    })
    .catch((m) => {
      //TODO: make an error message consistent with commission report
      console.log("Error! In attendance-report-endpoint catch block.");
      console.log(m);
    });
}
