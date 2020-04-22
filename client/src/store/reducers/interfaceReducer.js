import { bindActionCreators } from "redux";
import * as Actions from "store/actions";
import BaseReducer from "./baseReducer";
import * as actionTypes from "store/types.js";
import * as themes from "constants/themes.js";


export default class SettingsReducer extends BaseReducer {
  initialState = {
    reportsSidebarSelectedItem: 0,
    devSidebarSelectedItem: 0,
  };

  [actionTypes.SET_INTERFACE_ENTRY](state, action) {
    return {
      ...state,
      [action.payload.key]: action.payload.value,
    };
  }
}


