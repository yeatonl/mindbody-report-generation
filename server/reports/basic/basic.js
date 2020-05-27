import J2C from "json2csv";

//return null if the format is invalid and otherwise the format
export function getFormat(value) {
  if (typeof value === "string") {
    value = value.toLowerCase();
    if (value === "json" || value === "csv") {
      return value;
    }
  }
  return null;
}

//return null if the date is invalid and otherwise a string
export function getDate(value) {
  if (typeof value === "string") {
    var date = new Date(value);
    if (date.getDate()) {
      return date.toISOString();
    } else {
      return null;
    }
  }
  return value.toISOString();
}

//flatten a dictionary so it can be exported as a csv
export function flatten(obj, prefix) {
  if (!prefix) {
    prefix = "";
  }
  var result = {};
  var keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!obj[key] || Array.isArray(obj[key])) {
      continue;
    } else if (typeof obj[key] === "object") {
      let descendant = flatten(obj[key], prefix + key + ".");
      result = Object.assign(result, descendant);
    } else {
      result[prefix + key] = obj[key];
    }
  }
  return result;
}

//convert a list of objects to a format that json2csv expects
export function getHeadersAndData(data) {
  var headers = new Set();
  var items = [];
  for (let i = 0; i < data.length; i++) {
    var item = flatten(data[i]);
    items.push(item);
    Object.keys(item).forEach((x) => {headers.add(x);});
  }
  return {
    rows: items,
    headers: Array.from(headers)
  };
}

//convert a list of objects to a csv string
export function toCSV(data) {
  var csvdata = getHeadersAndData(data);
  return J2C.parse(csvdata.rows, csvdata.headers);
}

//format json for the front-end to generate csv files
//i.e. a list of objects is converted to a list of lists
export function formatJSON(data) {
  var csvdata = getHeadersAndData(data);
  var rows = [];
  for (let i = 0; i < csvdata.rows.length; i++) {
    var item = csvdata.rows[i];
    var row = [];
    for (let j = 0; j < csvdata.headers.length; j++) {
      var key = csvdata.headers[j];
      if (key in item) {
        row.push(item[key]);
      } else {
        row.push("");
      }
    }
    rows.push(row);
  }
  return {
    headers: csvdata.headers,
    data: rows
  };
}
