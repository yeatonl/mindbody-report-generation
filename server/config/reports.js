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
        "tooltip": "Data before this date will be excluded",
        "validation": [
          {
            "regex": "^((0[0-9])|(1[0-2]))/(([0-2][0-9])|(3[0-1]))/([0-9]{4})$",
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
        "data": {}
      },
      {
        "key": "enddate",
        "type": "DATE",
        "label": "End date",
        "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY",
        "tooltip": "Data after this date will be excluded",
        "span": "2",
        "validation": [
          {
            "regex": "^((0[0-9])|(1[0-2]))/(([0-2][0-9])|(3[0-1]))/([0-9]{4})$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Format: mm/dd/yyyy"
          }
        ],
        "data": {}
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
        "description": "Controls the date at which the report data begins. Only data after this date will be returned. Must be in the format MM/DD/YYYY",
        "tooltip": "Data before this date will be excluded",
        "validation": [
          {
            "regex": "^((0[0-9])|(1[0-2]))/(([0-2][0-9])|(3[0-1]))/([0-9]{4})$",
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
        "data": {}
      },
      {
        "key": "enddate",
        "type": "DATE",
        "label": "End date",
        "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY",
        "tooltip": "Data after this date will be excluded",
        "span": "2",
        "validation": [
          {
            "regex": "^((0[0-9])|(1[0-2]))/(([0-2][0-9])|(3[0-1]))/([0-9]{4})$",
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
        "data": {}
      }
    ]
  }
};

export default reports;
