const https = require("https");
const querystring = require("querystring");
const util = require("util");
const key = "bfc05de4947f464f85ecd85deff6895e";

var auth = "5c44ce49f6c8499399f53174536beb2602b74eaf41af4cd29e5df1c3db8db6ba";
//var auth = "";
//printAuthorizationKey("Siteowner", "apitest1234");

function getRequest(path, payload, callback) {
  var options = getOptions(path);
  options.method = "GET";
  options.path += "?" + querystring.stringify(payload);
  console.log("GET " + options.host + options.path);
  const req = https.request(options, callback);
  req.on("error", e => console.log(e));
  req.end();
}

function postRequest(path, payload, callback) {
  var options = getOptions(path);
  options.method = "POST";
  payload = JSON.stringify(payload);
  options.headers["Content-Length"] = payload.length;
  console.log("POST " + options.host + options.path);
  const req = https.request(options, callback);
  req.on("error", e => conosle.log(e));
  req.write(payload);
  req.end();
}

function getOptions(path) {
  return {
    host: "api.mindbodyonline.com",
    path: "/public/v6/" + path ,
    headers: {
      "Api-Key": key,
      "SiteId": "-99",
      "Authorization": auth,
      "Content-Type": "application/json"
    }
  };
}

function printAuthorizationKey(username, password) {
  var payload = {
    "Username": username,
    "Password": password
  };
  postRequest("usertoken/issue", payload, res => {
    res.on("data", d => console.log(JSON.parse(d)));
  });
}

class CommissionReport {
  constructor() {
    this.startDate = "";
    this.sales = {};
    this.visits = {};
    this.products = {};
    this.services = {};
  }

  setStartDate(date) {
    this.startDate = date;
  }

  /** Return a promise for the generated report. */
  generate() {
    return this.requestSales()
      .then(this.requestSaleItems.bind(this))
      .then(this.requestVisits.bind(this))
      .then(this.merge.bind(this));
  }

  /** Return a promise for the revenue of each instructor.
  Value format: {staff_name: {service_name/product_name: revenue}} */
  merge() {
    var params = {showHidden: false, depth: null};
    console.log("sales:", util.inspect(this.sales, params));
    console.log("services:", util.inspect(this.services, params));
    console.log("products:", util.inspect(this.products, params));
    console.log("visits:", util.inspect(this.visits, params));

    return new Promise((resolve, reject) => {
      var staff = {};
      for (const clientID in this.visits) {
        this.updateServiceRevenue(staff, clientID);
        this.updateProductRevenue(staff, clientID);
      }
      resolve(staff);
    });
  }

  /** Update the revenue for staff members for a given client. */
  updateServiceRevenue(staff, clientID) {
    var visits = this.visits[clientID];
    for (let i = 0; i < visits.length; i++) {
      var staffID = visits[i].StaffId;
      var serviceID = visits[i].ServiceId;

      if (serviceID in this.services == false) {
        console.warn(`${serviceID} not in services`);
        continue;
      }

      if (staffID in staff == false)
        staff[staffID] = {};
      if (serviceID in staff[staffID] == false)
        staff[staffID][serviceID] = 0.0;

      var service = this.services[serviceID];
      if (service.Type == "Unlimited")
        payment = service.Price / this.getServiceUsage(visits, serviceID);
      else
        payment = service.Price / service.Count;

      staff[staffID][serviceID] += payment;
    }
  }

  /** Return the number of times a service was used. */
  getServiceUsage(visits, serviceID) {
    var count = 0;
    for (let i = 0; i < visits.length; i++)
      if (visits[i].ServiceId == serviceID)
        count++;
    return count;
  }

  /** Divide product revenues among staff based on client visits. */
  updateProductRevenue(staff, clientID) {
    var staffIDs = [];
    var visits = this.visits[clientID];
    for (let i = 0; i < visits.length; i++) {
      var staffID = visits[i].StaffId;
      staffIDs.push(staffID);
      if (staffID in staff == false)
        staff[staffID] = {};
    }

    var sales = this.sales[clientID];
    for (let i = 0; i < sales.length; i++) {
      var purchases = sales[i].PurchasedItems;
      for (let j = 0; j < purchases.length; j++)
        if (purchases[j].BarcodeId in this.products)
          this.distributeProductRevenue(
            staff, purchases[j].BarcodeId, staffIDs);
    }
  }

  /** Distribute revenue for a product among instructors. */
  distributeProductRevenue(staff, productID, staffIDs) {
    if (productID in this.products == false) {
      console.warn(`${productID} not in products`);
      return;
    }

    var price = this.products[productID].Price;
    for (let i = 0; i < staffIDs.length; i++) {
      var staffID = staffIDs[i];
      if (productID in staff[staffID] == false)
        staff[staffID][productID] = 0.0;
      staff[staffID][productID] += price / staffIDs.length;
    }
  }

  /** Return a promise for all sale items. */
  requestSaleItems() {
    var serviceIDs = new Set();
    var productIDs = new Set();
    for (const clientID in this.sales) {
      var sales = this.sales[clientID];
      for (let i = 0; i < sales.length; i++) {
        var items = sales[i].PurchasedItems;
        for (let j = 0; j < items.length; j++) {
          if (items[j].BarcodeId)
            productIDs.add(items[j].BarcodeId);
          else
            serviceIDs.add(items[j].Id);
        }
      }
    }
    return Promise.all([
      this.requestProducts(Array.from(productIDs)),
      this.requestServices(Array.from(serviceIDs))
    ]);
  }

  /** Return sales for each client from a list of all sales. */
  parseSales(sales) {
    var clients = {};
    for (let i = 0; i < sales.length; i++) {
      var clientID = sales[i].ClientId;
      if (clientID in clients == false)
        clients[clientID] = [];
      clients[clientID].push(sales[i]);
    }
    return clients;
  }

  /** Return a promise for all product and service sales. */
  requestSales() {
    var self = this;
    return new Promise((resolve, reject) => {
      var payload = {
        StartDateTime: this.startDate,
        PaymentMethodId: 1 // REMOVE
      };
      getRequest("sale/sales", payload, resp => {
        var data = "";
        resp.on("data", chunk => data += chunk);
        resp.on("error", reject);
        resp.on("end", () => {
          self.sales = self.parseSales(JSON.parse(data).Sales);
          resolve();
        });
      });
    });
  }

  /** Return a promise for all visit information using client sales. */
  requestVisits() {
    var clientVisits = [];
    for (const clientID in this.sales)
      clientVisits.push(this.requestClientVisits(clientID));
    return Promise.all(clientVisits);
  }

  /** Return a promise for visit information of a single client. */
  requestClientVisits(clientID) {
    var self = this;
    return new Promise((resolve, reject) => {
      var payload = {
        ClientId: clientID,
        StartDateTime: this.startDate
      };
      getRequest("client/clientvisits", payload, resp => {
        var data = "";
        resp.on("data", chunk => data += chunk);
        resp.on("error", reject);
        resp.on("end", () => {
          self.visits[clientID] = JSON.parse(data).Visits;
          resolve();
        });
      });
    });
  }

  /** Return a promise for service pricing info. */
  requestServices(services) {
    var self = this;
    return new Promise((resolve, reject) => {
      getRequest("sale/services", {ServiceIds: services}, resp => {
        var data = "";
        resp.on("data", chunk => data += chunk);
        resp.on("error", reject);
        resp.on("end", () => {
          self.services = self.productListToDict(JSON.parse(data).Services);
          resolve();
        });
      });
    });
  }

  /** Return a promise for product pricing info. */
  requestProducts(products) {
    var self = this;
    return new Promise((resolve, reject) => {
      getRequest("sale/products", {ProductIds: products}, resp => {
        var data = "";
        resp.on("data", chunk => data += chunk);
        resp.on("error", reject);
        resp.on("end", () => {
          self.products = self.productListToDict(JSON.parse(data).Products);
          resolve();
        });
      });
    });
  }

  /** Return a dictionary for easier product lookups. */
  productListToDict(products) {
    var result = {};
    for (let i = 0; i < products.length; i++)
      result[products[i].Id] = products[i];
    return result;
  }
}

var report = new CommissionReport();
report.setStartDate("2020-04-09T00:00:00");
report.generate().then(staff => console.log(staff));

//getRequest("sale/sales", {
//    Limit:200,
//    PaymentMethodId:1
//    StartSaleDateTime:"2020-04-09T12:00:00Z",
//    EndSaleDateTime:"2020-04-09T23:59:00Z"
//}, resp => {
//  var data = "";
//  resp.on("data", chunk => data += chunk);
//  resp.on("end", () => {
//    console.log(JSON.parse(data));
//    var sales = JSON.parse(data).Sales;
//    for (let i = 0; i < sales.length; i++)
//      console.log(sales[i]);
//  });
//});
//
//getRequest("sale/products", {}, resp => {
//  var data = "";
//  resp.on("data", chunk => data += chunk);
//  resp.on("end", () => {
//    var x = JSON.parse(data).Products;
//    for (let i = 0; i < x.length; i++)
//      console.log(x[i]);
//  });
//});
//
//getRequest("sale/services", {}, resp => {
//  var data = "";
//  resp.on("data", chunk => data += chunk);
//  resp.on("end", () => {
//    var x = JSON.parse(data).Services;
//    for (let i = 0; i < x.length; i++)
//      console.log(x[i]);
//  });
//});
//
//var cart = {
//  Test: false,
//  ClientId: 100014871,
//  Items: [
//    {Item: {Type: "Product", Metadata: {Id: "0001"}}, Quantity: 22},
//    {Item: {Type: "Product", Metadata: {Id: "0002"}}, Quantity: 6}
//  ],
//  InStore: true,
//  Payments: [
//    {
//      Type: "Cash",
//      Metadata: {
//        Amount: 53.52,
//        Notes: "Tip"
//      }
//    }
//  ],
//  LocationId: 1
//};
//
//postRequest("sale/checkoutshoppingcart", cart, resp => {
//  var data = "";
//  resp.on("data", chunk => data += chunk);
//  resp.on("end", () => {
//    console.log(JSON.parse(data));
//  });
//});
