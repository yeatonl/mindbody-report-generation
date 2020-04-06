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

export const setInterfaceEntry = (key, value) => {
  store.dispatch({
    type: actionTypes.SET_INTERFACE_ENTRY,
    error: null,
    meta: null,
    payload: {key, value},
  });
};

