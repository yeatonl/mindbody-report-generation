import store from "store/store.js";
import * as actionTypes from "store/types.js";

export const setTheme = (theme) => {
  store.dispatch({
    type: actionTypes.SET_THEME,
    error: null,
    meta: null,
    payload: {theme},
  });
};
