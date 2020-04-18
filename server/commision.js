import https from "https";
import querystring from "querystring";
import util from "util";

const key = "bfc05de4947f464f85ecd85deff6895e";
var auth = "bf423f7b7f224ba589d42eb982856640d1e847d7608e4cb5a55f530909fc3c70";
//var auth = "";
//printAuthorizationKey("Siteowner", "apitest1234");

//to add client visits: sandbox -> classes -> sign in -> search for client -> add
//to add sales: sandbox -> retail -> client search -> add item

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
    //a different start date is used to determine all the previous
    //instructors for a client
    this.visitStartDate = "2000-01-01T00:00:00";
    this.sales = {};
    this.visits = {};
    this.products = {};
    this.services = {};
  }

  setStartDate(date) {
    this.startDate = date;
  }

  //return a promise for the generated report
  generate() {
    return this.requestSales()
      .then(this.requestSaleItems.bind(this))
      .then(this.requestVisits.bind(this))
      .then(this.merge.bind(this));
  }

  //return a promise for the revenue of each instructor.
  //format: {staff_name: {service_name/product_name: revenue}}
  merge() {
    var params = {showHidden: false, depth: null};
    console.log("sales:", util.inspect(this.sales, params));
    console.log("services:", util.inspect(this.services, params));
    console.log("products:", util.inspect(this.products, params));
    console.log("visits:", util.inspect(this.visits, params));

    return new Promise((resolve, reject) => {
      var staff = {};
      for (const clientID in this.visits)
        this.incorporateSales(staff, clientID);
      resolve(staff);
    });
  }

  //add sales to staff members
  incorporateSales(staff, clientID) {
    var sales = this.sales[clientID];
    for (let i = 0; i < sales.length; i++)
      this.incorporatePurchases(staff, sales[i], clientID);
  }

  //add purchases within a sale to staff members
  incorporatePurchases(staff, sale, clientID) {
    var date = Date.parse(sale.SaleDateTime);
    for (let i = 0; i < sale.PurchasedItems.length; i++) {
      var purchase = sale.PurchasedItems[i];
      var staffIDs = this.getPriorInstructors(date, clientID);
      var item = this.getItem(purchase);

      for (let j = 0; j < staffIDs.length; j++) {
        var staffID = staffIDs[j];
        if (staffID in staff == false)
          staff[staffID] = {};

        if (item.Id in staff[staffID] == false)
          staff[staffID][item.name] = item.price / staffIDs.length;
        else
          staff[staffID][item.name] += item.price / staffIDs.length;
      }
    }
  }

  //return the name and price of a purchase
  getItem(purchase) {
    var item = {
      name: "",
      price: 0.0
    };
    if (purchase.BarcodeId) {
      item.name = purchase.BarcodeId;
      if (purchase.BarcodeId in this.products) {
        item.name = this.products[purchase.BarcodeId].Name;
        item.price = this.products[purchase.BarcodeId].Price;
      } else
        console.warn(`${purchase.BarcodeId} not in products`);
    } else {
      item.name = purchase.Id;
      if (purchase.Id in this.services) {
        item.name = this.services[purchase.Id].Name;
        item.price = this.services[purchase.Id].Price;
      } else
        console.warn(`${purchase.Id} not in services`);
    }
    return item;
  }

  //return a list of staff IDs that the client visited before a date
  getPriorInstructors(saleDate, clientID) {
    var staffIDs = [];
    var visits = this.visits[clientID];
    for (let i = 0; i < visits.length; i++) {
      var staffID = visits[i].StaffId;
      var classDate = Date.parse(visits[i].StartDateTime);
      if (saleDate > classDate)
        staffIDs.push(staffID);
    }
    //still mention purchases even if there was no previous instructor
    if (staffIDs.length == 0)
      staffIDs.push(0);
    return staffIDs;
  }

  //return a promise for all sale items
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

  //return sales for each client from a list of all sales.
  //format: {client: sales}
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

  //return a promise for all product and service sales
  requestSales() {
    var self = this;
    return new Promise((resolve, reject) => {
      var payload = {
        StartDateTime: this.startDate,
        PaymentMethodId: 1 //REMOVE
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

  //return a promise for all visit information using client sales
  requestVisits() {
    var clientVisits = [];
    for (const clientID in this.sales)
      clientVisits.push(this.requestClientVisits(clientID));
    return Promise.all(clientVisits);
  }

  //return a promise for visit information of a single client
  requestClientVisits(clientID) {
    var self = this;
    return new Promise((resolve, reject) => {
      var payload = {
        ClientId: clientID,
        StartDateTime: this.visitStartDate
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

  //return a promise for service pricing info
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

  //return a promise for product pricing info
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

  //return a dictionary for easier product lookups
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
