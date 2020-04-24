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



export const fetchReportData = (url, report) => {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      store.dispatch({
        type: actionTypes.SET_REPORT_DATA_AND_HEADERS,
        error: null,
        meta: null,
        payload: {report, data: data.data, headers: data.headers},
      });
    })
    .catch((error) => {
      throw "Unknown error occurred in fetchReportData";
    });
};


export const fetchReportParameters = (url, report) => {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      store.dispatch({
        type: actionTypes.SET_REPORT_PARAMETERS,
        error: null,
        meta: null,
        payload: {report, parameters: data.parameters},
      });
    })
    .catch((error) => {
      throw "Unknown error occurred in fetchReportParameters";
    });
};

