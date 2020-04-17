import { bindActionCreators } from "redux";
import * as Actions from "store/actions";
import BaseReducer from "./baseReducer";
import * as actionTypes from "store/types.js";
import * as themes from "constants/themes.js";


export default class SettingsReducer extends BaseReducer {
  initialState = {
    theme: themes.DARK,
  };

  [actionTypes.SET_THEME](state, action) {
    return {
      ...state,
      theme: action.payload.theme,
    };
  }
}


