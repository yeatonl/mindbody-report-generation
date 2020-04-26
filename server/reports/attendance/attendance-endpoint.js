import MindbodyAccess from "../../api-manager";
import J2C from "json2csv";

//returns the current date without slashes
function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + "-" + dd + "-" + yyyy; //current date without slashes 
  return today;
}

//returns true if "toCheck" date is between (or equivalent to) start and end dates.
//all parameters are strings in the form of mm/dd/yyyy
function isValidDate(start, end, toCheck) {
  //TODO: use the next two lines of code if I decide to change check date format within the function
  let toCheckSplit = toCheck.split(/[-\/TU]/);
  let fixedCheck = toCheckSplit[1] + "/" + toCheckSplit[2] + "/" + toCheckSplit[0]; //note variable name isn't toCheck.
  let startDate = Date.parse(start); //I guess Date.parse handles various common date delimeters including - and / and empty space
  let endDate = Date.parse(end);
  let checkDate = Date.parse(fixedCheck);
  return (checkDate >= startDate && checkDate <= endDate) ? true : false;
}

function getNumberAttended(classID) {
  return new Promise ((resolve, reject) => {
    MindbodyAccess.getClassVisits({ClassID: classID})
      .then((classVisits) => {
        let numberAttended = Object.keys(classVisits.Class.Visits).length;
        resolve(numberAttended);
      })
    })
}

export function attendanceRequestHandler(request, response) {
  //endpoint URL example
  //http://localhost:8080/reports/attendance?format=csv&startdate=01/01/2020&enddate=12/31/2020
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

  MindbodyAccess.getAuth()
    .then((value) => {
      MindbodyAccess.authToken = value.AccessToken;
      return MindbodyAccess.getClasses();
    })
    .then((classes) => {
      let attendanceReport = [];
      let numberOfClasses = Object.keys(classes.Classes).length;
      // fills classData object with necessary information then pushes it to attendanceReport list
      let allPromises = [];
      for (let i = 0; i < numberOfClasses; ++i) {
        let classID = classes.Classes[i].Id; // unique class ID
        let maxCapacity = classes.Classes[i].MaxCapacity; // maximum number of students that can enroll for that class
        let numberRegistered = classes.Classes[i].TotalBooked; // number of students who registered for that class
        let classDate = classes.Classes[i].StartDateTime; // startDateTime format is yyyy/mm/dd by default. Altered in isValidDate
        if (isValidDate(startdate, enddate, classDate)) {
          let classData = {
            class: classID,
            capacity: maxCapacity,
            registered: numberRegistered,
          };
          let myPromise = getNumberAttended(classID)
            .then((numberAttended) => {
              //console.log(numberAttended);
              classData["attended"] = numberAttended;
              attendanceReport.push(classData);
            })
            .catch((err) => {
              console.log("ERROR! ", err);
            })
          allPromises.push(myPromise);
        }
      }
      Promise.all(allPromises).then(() => {
        // outputs data as .csv
        if (format === "csv") {
          let fields = ["class", "capacity", "registered", "attended"];
          let parser = new J2C.Parser({ fields });
          let csv = parser.parse(attendanceReport);
          response.send(csv);
          //outputs data as json
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