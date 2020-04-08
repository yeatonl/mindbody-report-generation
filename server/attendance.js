#!/usr/bin/nodejs
const fetch = require("node-fetch");
const fs = require("fs");

const baseUrl = "https://api.mindbodyonline.com/public/v6/";
const apiKey = "3db155a81cb8456c9fafabfb141be3a5";
const siteID = "-99";

//TODO: Don't make authorization const. Make function to update/refresh it upon use.
const authorization = "1f5b151cef6d4ced833f712e485b12fc3d96f929922e4b34b580bb3793f0fd97";

//Get Authrization Token
//TODO: Implement JS code for this later
/*
curl -X POST \
  https://api.mindbodyonline.com/public/v6/usertoken/issue \
  -H 'Content-Type: application/json' \
  -H 'Api-Key: 3db155a81cb8456c9fafabfb141be3a5' \
  -H 'SiteId: -99' \
  -d '{
    "Username": "Siteowner",
    "Password": "apitest1234"
}'
*/

//************************ Garbage code I need help with AKA help understanding architecture.

const classesPath = baseUrl + "class/classes?";
const clientPath = baseUrl + "client/clients";
const locationPath = baseUrl + "site/locations";

var badDataToReturn = {};

const getData = {
  "method": "GET",
  "headers": {
    "Content-Type": "application/json",
    "Api-Key": apiKey,
    "SiteId": siteID,
    "User-Agent": "MindBody-reports-Capstone",
    "Authorization": authorization 
  },
}

//Gets JSON of class data
fetch(classesPath, getData)
  .then(response => { return response.json(); })
  .then(data => {
    //console.log(data.Classes);
    data.Classes.forEach(element => {
      //console.log(element.ClassScheduleId);
      badDataToReturn["ClassScheduleId"] = element.ClassScheduleId;
      badDataToReturn["MaxCapacity"] = element.MaxCapacity;
      badDataToReturn["TotalBooked"] = element.TotalBooked;
      console.log(badDataToReturn);
    });
  })

//Gets JSON of client data
fetch(clientPath, getData)
  .then(response => { return response.json(); })
  .then(data => {
    //console.log(data);
  })

//Gets JSON of location data
fetch(locationPath, getData)
.then(response => { return response.json(); })
.then(data => {
  //console.log(data);
})

//************************ EOF garbage code I need help with

class AttendanceReport {
  constructor() {
    this.studioName = "";
    this.classID = "";
    this.maxCapacity = "";
    this.attendance = ""; //number of students that signed up
    this.studentList = {}; //JSON of student names, ID#, gender, etc.
    this.poleData = {}; // HELPPPP :(
    this.season = "";
  }

  /* Outputs attendance report as JSON 
  generateReport(){
    return;
  }
  */
}


