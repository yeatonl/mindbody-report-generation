import { bindActionCreators } from "redux";
import * as Actions from "store/actions";
import BaseReducer from "./baseReducer";
import * as actionTypes from "store/types.js";
import * as themes from "constants/themes.js";
import * as Validation from "constants/validation.js";

export default class ReportsReducer extends BaseReducer {
  initialState = {
    "ATTENDANCE": {
      label: "Attendance",
      key: "ATTENDANCE",
      jsonEndpoint: "/reportsAttendanceJson",
      csvEndpoint: "/reportsAttendanceCsv",
      parametersEndpoint: "/reportsAttendanceParameters",
      localLink: "/reports/attendance",
      headers: [],
      data: [],
      parameters: [
        {
          "key": "startdate",
          "type": "DATE",
          "label": "Start date",
          "description": "Controls the date at which the report data begins. Only data after this date will be returned. Must be in the format MM/DD/YYYY",
          "tooltip": "Data before this date will be excluded",
          "validation": Validation.DATE,
          "span": "2",
          "data": {},
        },
        {
          "key": "enddate",
          "type": "DATE",
          "label": "End date",
          "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY",
          "tooltip": "Data after this date will be excluded",
          "span": "2",
          "validation": Validation.DATE,
          "data": {},
        },
      ],
    },
    "COMMISSION": {
      label: "Commission",
      key: "COMMISSION",
      jsonEndpoint: "/reportsCommissionJson",
      csvEndpoint: "/reportsCommissionCsv",
      parametersEndpoint: "/reportsCommissionParameters",
      localLink: "/reports/commission",
      headers: [],
      data: [],
      parameters: [
        {
          "key": "startdate",
          "type": "DATE",
          "label": "Start date",
          "description": "Controls the date at which the report data begins. Only data after this date will be returned. Must be in the format MM/DD/YYYY",
          "tooltip": "Data before this date will be excluded",
          "validation": Validation.DATE,
          "span": "2",
          "invalidMessage": "Must be of the form MM/DD/YYYY",
          "data": {},
        },
        {
          "key": "enddate",
          "type": "DATE",
          "label": "End date",
          "description": "Controls the date at which the report data ends. Only data before this date will be returned. Must be in the format MM/DD/YYYY",
          "tooltip": "Data after this date will be excluded",
          "span": "2",
          "validation": Validation.DATE,
          "invalidMessage": "Must be of the form MM/DD/YYYY",
          "data": {},
        },
      ],
    },
  };


  [actionTypes.SET_REPORT_DATA_AND_HEADERS](state, action) {
    return {
      ...state,
      [action.payload.report]: {
        ...state[action.payload.report],
        data: action.payload.data,
        headers: action.payload.headers,
      },
    };
  }

  [actionTypes.SET_REPORT_PARAMETERS](state, action) {
    return {
      ...state,
      [action.payload.report]: {
        ...state[action.payload.report],
        parameters: action.payload.parameters,
      },
    };
  }
}


