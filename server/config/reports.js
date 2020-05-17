

let date = new Date();
let currentDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();

date.setTime(date.getTime()-14*24*60*60*1000); //two weeks ago
let twoWeeksAgoDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();

const reports = {
  "ATTENDANCE": {
    "label": "Attendance",
    "key": "ATTENDANCE",
    "jsonEndpoint": "/reports/attendance?format=json",
    "csvEndpoint": "/reports/attendance?format=csv",
    "localLink": "/reports/attendance",
    "headers": [],
    "data": [],
    "parameters": [
      {
        "key": "startdate",
        "type": "DATE",
        "label": "Start date",
        "description": "Controls the date at which the report data begins. Only data after this date will be returned. Must be in the format MM/DD/YYYY",
        "tooltip": "Data before this date will be excluded. If left blank, defaults to two weeks ago.",
        "validation": [
          {
            "regex": "^((1[0-2])|([1-9])|(0[1-9]))/((1[0-9])|(2[0-9])|(31)|(30)|([1-9])|(0[1-9]))/([12][0-9]{3})$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Format: mm/dd/yyyy"
          }
        ],
        "span": "2",
        "data": {},
        "initial": twoWeeksAgoDate
      },
      {
        "key": "enddate",
        "type": "DATE",
        "label": "End date",
        "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY.  If left blank, defaults to today.",
        "tooltip": "Data after this date will be excluded",
        "span": "2",
        "validation": [
          {
            "regex": "^((1[0-2])|([1-9])|(0[1-9]))/((1[0-9])|(2[0-9])|(31)|(30)|([1-9])|(0[1-9]))/([12][0-9]{3})$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Format: mm/dd/yyyy"
          }
        ],
        "data": {},
        "initial": currentDate
      }
    ]
  },
  "COMMISSION": {
    "label": "Commission",
    "key": "COMMISSION",
    "jsonEndpoint": "/reports/commission?format=json",
    "csvEndpoint": "/reports/commission?format=csv",
    "localLink": "/reports/commission",
    "headers": [],
    "data": [],
    "parameters": [
      {
        "key": "startdate",
        "type": "DATE",
        "label": "Start date",
        "description": "Controls the date at which the report data begins. Only data after this date will be returned. Must be in the format MM/DD/YYYY.  If left blank, defaults to two weeks ago.",
        "tooltip": "Data before this date will be excluded",
        "validation": [
          {
            "regex": "^((1[0-2])|([1-9])|(0[1-9]))/((1[0-9])|(2[0-9])|(31)|(30)|([1-9])|(0[1-9]))/([12][0-9]{3})$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Format: mm/dd/yyyy"
          }
        ],
        "span": "2",
        "invalidMessage": "Must be of the form MM/DD/YYYY",
        "data": {},
        "initial": twoWeeksAgoDate
      },
      {
        "key": "enddate",
        "type": "DATE",
        "label": "End date",
        "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY.  If left blank, defaults to today.",
        "tooltip": "Data after this date will be excluded",
        "span": "2",
        "validation": [
          {
            "regex": "^((1[0-2])|([1-9])|(0[1-9]))/((1[0-9])|(2[0-9])|(31)|(30)|([1-9])|(0[1-9]))/([12][0-9]{3})$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Format: mm/dd/yyyy"
          }
        ],
        "invalidMessage": "Must be of the form MM/DD/YYYY",
        "data": {},
        "initial": currentDate
      }
    ]
  }
};

export default reports;
