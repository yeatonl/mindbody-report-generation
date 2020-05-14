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

// takes a classID as a parameter and 
// returns the number of students that attended that class
function getNumberAttended(classID) {
  return new Promise ((resolve, reject) => {
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
        console.log("Filling attendance with dummy value of -9999\n");

        // resolving in the catch block because of ENOTFOUND error
        // this makes it so the report doesn't crash when this error appears.
        resolve(-9999);
      })
    })
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

  // access Mindbody Endpoints
  MindbodyAccess.getAuth()
    .then((value) => {
      MindbodyAccess.authToken = value.AccessToken;
      return MindbodyAccess.getClasses({
        StartDateTime: startdate,
        EndDateTime: enddate,
      });
    })
    // gets all classes from "Classes" endpoint
    .then((classes) => {
      let attendanceReport = {
        data: [],
        headers: ["classId", "class", "classStartTime", "capacity", "registered", "attended"],
      };
      let allNumberAttendedPromises = [];
      let numberOfClasses = Object.keys(classes.Classes).length;

      // iterates through every class in classes
      for (let i = 0; i < numberOfClasses; ++i) {
        let classId = classes.Classes[i].Id;

        // adds attendance parameter to classData
        let numberAttendedPromise = getNumberAttended(classId)
          .then((numberAttended) => {
            attendanceReport.data.push([
              classId,
              classes.Classes[i].ClassDescription.Name,
              classes.Classes[i].StartDateTime,
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

      // resolves all, allNumberAttendedPromises then outputs attendance report to endpoint as CSV or JSON
      Promise.all(allNumberAttendedPromises)
        .then(() => {
          if (format === "csv") {
            let fields = ["classId", "class", "classStartTime", "capacity", "registered", "attended"];
            let parser = new J2C.Parser({ fields });
            let csv = parser.parse(attendanceReport);
            let fileName = "AttendanceReport.csv";
            //todo: we should choose a filename that includes helpful info like the date range
            response.setHeader("Content-Disposition", "attachment ; filename=\"" + fileName + "\"");
            response.contentType("text/csv");
            response.send(csv);
          } else {
            response.json(attendanceReport);
          }
        });
    })
    .catch((m) => {
      //TODO: make an error message consistent with commission report
      console.log("Error! In attendance-report-endpoint catch block.");
      console.log(m);
    });
}