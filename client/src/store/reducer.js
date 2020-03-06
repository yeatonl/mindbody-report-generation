import { combineReducers } from "redux";
import ExampleReducer from "./reducers/exampleReducer.js";

export default combineReducers({
  example: new ExampleReducer().reducer,
});

