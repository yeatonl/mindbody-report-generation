import { combineReducers } from "redux";
import SettingsReducer from "./reducers/settingsReducer.js";
import InterfaceReducer from "./reducers/interfaceReducer.js";
import ReportsReducer from "./reducers/reportsReducer.js";

export default combineReducers({
  settings: new SettingsReducer().reducer,
  interface: new InterfaceReducer().reducer,
  reports: new ReportsReducer().reducer,
});

