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
        "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY.  If left blank, defaults to today.",
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
        "description": "Controls the date at which the report data begins. Only data after this date will be returned. Must be in the format MM/DD/YYYY.  If left blank, defaults to two weeks ago.",
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
        "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY.  If left blank, defaults to today.",
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
  },
  "CLASSES": {
    "label": "Classes",
    "key": "CLASSES",
    "jsonEndpoint": "/reports/classes?format=json",
    "csvEndpoint": "/reports/classes?format=csv",
    "localLink": "/reports/classes",
    "headers": [],
    "data": [],
    "parameters": [
      {
        "key": "startdate",
        "type": "DATE",
        "label": "Start date",
        "description": "The default start date is today. Format: MM/DD/YYYY",
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
        "description": "The default start date is today. Format: MM/DD/YYYY",
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
  },
  "SALES": {
    "label": "Sales",
    "key": "SALES",
    "jsonEndpoint": "/reports/sales?format=json",
    "csvEndpoint": "/reports/sales?format=csv",
    "localLink": "/reports/sales",
    "headers": [],
    "data": [],
    "parameters": [
      {
        "key": "startdate",
        "type": "DATE",
        "label": "Start date",
        "description": "The default start date is today. Format: MM/DD/YYYY",
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
        "description": "The default start date is today. Format: MM/DD/YYYY",
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
  },
  "STAFF": {
    "label": "Staff",
    "key": "STAFF",
    "jsonEndpoint": "/reports/staff?format=json",
    "csvEndpoint": "/reports/staff?format=csv",
    "localLink": "/reports/staff",
    "headers": [],
    "data": [],
  },
  "LOCATIONS": {
    "label": "Locations",
    "key": "LOCATIONS",
    "jsonEndpoint": "/reports/locations?format=json",
    "csvEndpoint": "/reports/locations?format=csv",
    "localLink": "/reports/locations",
    "headers": [],
    "data": [],
  },
  "PROGRAMS": {
    "label": "Programs",
    "key": "PROGRAMS",
    "jsonEndpoint": "/reports/programs?format=json",
    "csvEndpoint": "/reports/programs?format=csv",
    "localLink": "/reports/programs",
    "headers": [],
    "data": [],
    "parameters": [
      {
        "key": "type",
        "type": "STRING",
        "label": "Types",
        "description": "An optional parameter to filter on a specific session type.",
        "tooltip": "Reduces the number of programs returned",
        "validation": [
          {
            "regex": "^(all|class|enrollment|appointment|resource|media|arrival)$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Not a valid session type"
          }
        ],
        "span": "2",
        "invalidMessage": "Not a valid session type",
        "data": {}
      },
      {
        "key": "onlineonly",
        "type": "STRING",
        "label": "Online Only",
        "description": "Get programs that are online only.",
        "tooltip": "Reduces the number of programs returned",
        "span": "2",
        "validation": [
          {
            "regex": "^(yes|true|false|no)$",
            "result": true,
            "message": ""
          },
          {
            "regex": ".*",
            "result": false,
            "message": "Must be true or false"
          }
        ],
        "invalidMessage": "Must be true or false",
        "data": {}
      }
    ]
  }
};

export default reports;
