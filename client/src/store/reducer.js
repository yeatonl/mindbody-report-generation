import { combineReducers } from "redux";
import SettingsReducer from "./reducers/settingsReducer.js";

export default combineReducers({
  settings: new SettingsReducer().reducer,
});

