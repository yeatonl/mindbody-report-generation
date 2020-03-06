import { bindActionCreators } from "redux";
import * as Actions from "store/actions";
import BaseReducer from "./baseReducer";


export default class ExampleReducer extends BaseReducer {
  initialState = {
    exampleField: false
  };

  [Actions.EXAMPLE_ACTION().type](state, action) {
    return {
      exampleField: !state.exampleField
    };
  }
}


