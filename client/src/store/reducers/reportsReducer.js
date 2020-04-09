import { bindActionCreators } from "redux";
import * as Actions from "store/actions";
import BaseReducer from "./baseReducer";
import * as actionTypes from "store/types.js";
import * as themes from "constants/themes.js";


export default class ReportsReducer extends BaseReducer {
  initialState = {

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


