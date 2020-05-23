import MindbodyAccess from "../../api-manager.js";
import * as basic from "./basic.js";

function sendResponse(response, data, format, name) {
  var filename = name + "." + format;
  if (format === "csv") {
    response.setHeader(
      "Content-Disposition", "attachment; filename=\"" + filename + "\"");
    response.contentType("text/csv");
    response.send(data);
  } else if (format === "json") {
    response.json(basic.formatJSON(data));
  }
}

export function getClasses(options) {
  var payload = {};
  if (options.startdate) {
    payload.StartDateTime = basic.getDate(options.startdate);
    if (!payload.StartDateTime) {
      return Promise.reject("invalid start date");
    }
  }
  if (options.enddate) {
    payload.EndDateTime = basic.getDate(options.enddate);
    if (!payload.EndDateTime) {
      return Promise.reject("invalid end date");
    }
  }
  if (options.id) {
    payload.ClassIds = options.id;
  }
  return MindbodyAccess.getAuth().then(() => {
    return MindbodyAccess.getClasses(payload).then((data) => {
      if (options.format.toLowerCase() === "csv") {
        return basic.toCSV(data.Classes);
      }
      return data.Classes;
    });
  });
}

export function classesRequestHandler(request, response) {
  var format = basic.getFormat(request.query.format);
  if (!format) {
    response.send("invalid report format");
    return;
  }
  getClasses(request.query).then((classes) => {
    sendResponse(response, classes, format, "classes");
  }).catch((message) => {
    response.send(message);
  });
}

//add the total payment because payments will be lost in the csv
function addSaleTotal(sales) {
  for (let i = 0; i < sales.length; i++) {
    var sale = sales[i];
    var total = 0.0;
    for (let j = 0; j < sale.Payments.length; j++) {
      total += sale.Payments[j].Amount;
    }
    sale.PaymentAmount = total;
  }
  return sales;
}

export function getSales(options) {
  var payload = {};
  if (options.startdate) {
    payload.StartSaleDateTime = basic.getDate(options.startdate);
    if (!payload.StartSaleDateTime) {
      return Promise.reject("invalid start date");
    }
  }
  if (options.enddate) {
    payload.EndSaleDateTime = basic.getDate(options.enddate);
    if (!payload.EndSaleDateTime) {
      return Promise.reject("invalid end date");
    }
  }
  return MindbodyAccess.getAuth().then(() => {
    return MindbodyAccess.getSales(payload).then((data) => {
      if (options.format.toLowerCase() === "csv") {
        return basic.toCSV(data.Sales);
      }
      return addSaleTotal(data.Sales);
    });
  });
}

export function salesRequestHandler(request, response) {
  var format = basic.getFormat(request.query.format);
  if (!format) {
    response.send("invalid report format");
    return;
  }
  getSales(request.query).then((sales) => {
    sendResponse(response, sales, format, "sales");
  }).catch((message) => {
    response.send(message);
  });
}

export function getStaff(options) {
  return MindbodyAccess.getAuth().then(() => {
    return MindbodyAccess.getStaff().then((data) => {
      if (options.format.toLowerCase() === "csv") {
        return basic.toCSV(data.StaffMembers);
      }
      return data.StaffMembers;
    });
  });
}

export function staffRequestHandler(request, response) {
  var format = basic.getFormat(request.query.format);
  if (!format) {
    response.send("invalid report format");
    return;
  }
  getStaff(request.query).then((staff) => {
    sendResponse(response, staff, format, "staff");
  }).catch((message) => {
    response.send(message);
  });
}

export function getLocations(options) {
  return MindbodyAccess.getAuth().then(() => {
    return MindbodyAccess.getLocations().then((data) => {
      if (options.format.toLowerCase() === "csv") {
        return basic.toCSV(data.Locations);
      }
      return data.Locations;
    });
  });
}

export function locationsRequestHandler(request, response) {
  var format = basic.getFormat(request.query.format);
  if (!format) {
    response.send("invalid report format");
    return;
  }
  getLocations(request.query).then((locations) => {
    sendResponse(response, locations, format, "locations");
  }).catch((message) => {
    response.send(message);
  });
}

export function getResources(options) {
  return MindbodyAccess.getAuth().then(() => {
    return MindbodyAccess.getResources().then((data) => {
      if (options.format.toLowerCase() === "csv") {
        return basic.toCSV(data.Resources);
      }
      return data.Resources;
    });
  });
}

export function resourcesRequestHandler(request, response) {
  var format = basic.getFormat(request.query.format);
  if (!format) {
    response.send("invalid report format");
    return;
  }
  getResources(request.query).then((resources) => {
    sendResponse(response, resources, format, "resources");
  }).catch((message) => {
    response.send(message);
  });
}

export const programOptions = [
  "all", "class", "enrollment", "appointment", "resource", "media", "arrival"
];

export function getPrograms(options) {
  var payload = {};
  if (options.type) {
    const type = options.type.toLowerCase();
    if (programOptions.includes(type)) {
      payload.ScheduleType = type;
    } else {
      return Promise.reject("invalid program type");
    }
  }
  if (options.onlineonly) {
    const onlineonly = options.onlineonly.toLowerCase();
    if (onlineonly === "true" || onlineonly === "yes") {
      payload.OnlineOnly = "true";
    } else if (onlineonly === "false" || onlineonly === "no") {
      payload.OnlineOnly = "false";
    } else {
      return Promise.reject("invalid boolean value for onlineonly");
    }
  }
  return MindbodyAccess.getAuth().then(() => {
    return MindbodyAccess.getPrograms(payload).then((data) => {
      if (options.format.toLowerCase() === "csv") {
        return basic.toCSV(data.Programs);
      }
      return data.Programs;
    });
  });
}

export function programsRequestHandler(request, response) {
  var format = basic.getFormat(request.query.format);
  if (!format) {
    response.send("invalid report format");
    return;
  }
  getPrograms(request.query).then((programs) => {
    sendResponse(response, programs, format, "programs");
  }).catch((message) => {
    response.send(message);
  });
}
