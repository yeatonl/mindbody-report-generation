import https from "https";
import querystring from "querystring";
import util from "util";
/*
const https = require("https");
const querystring = require("querystring");
const util = require("util");
*/
//const key = "bfc05de4947f464f85ecd85deff6895e";
const key = "7db287c206374b2f911ddc918879983d"; // Dan's API key

var auth = "939094d5c42a409bbbfa7fe9f5bc065521ecfa58a75b47d2bdb4383fd53a00e7";
//to authenticate with MB during debugging, you need to uncomment these next few lines.
//submit a blank auth_key to MB and use printAuthorizationKey to request a new auth_key.
//then, take the returned new auth_key and paste it into var auth = "..." above.
//eventually, this kludge method will be replaced by MindbodyQueries which will do this
//more cleanly.
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
  req.on("error", e => console.log(e));
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

export function printAuthorizationKey(username, password) {
  var payload = {
    "Username": username,
    "Password": password
  };
  postRequest("usertoken/issue", payload, res => {
    res.on("data", d => console.log(JSON.parse(d)));
  });
}

export class CommissionReport {
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
  //         ^^^ staff_name of 0 is a special value, noPriorInstructorKey
  merge() {
    var params = {showHidden: false, depth: null};
    //console.log("sales:", util.inspect(this.sales, params));
    //console.log("services:", util.inspect(this.services, params));
    //console.log("products:", util.inspect(this.products, params));
    //console.log("visits:", util.inspect(this.visits, params));

    return new Promise((resolve, reject) => {
      var staff = {};
      for (const clientID in this.visits)
        this.incorporateSales(staff, clientID);
      resolve(staff);
    });
  };

  static get noPriorInstructorKey() {
    return "0";
  };

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
      staffIDs.push(CommissionReport.noPriorInstructorKey);
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
    if (!sales) {
      sales = [];
    }
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
    if (!products) {
      products = [];
    }
    for (let i = 0; i < products.length; i++)
      result[products[i].Id] = products[i];
    return result;
  }

  //todo: Floris had this code below to populate the server with sales data for 
  //testing. Daniel wants to leave it in for a few more commits until he's done 
  //testing the commission report output.
  addFakeSalesDataForTesting() {
    getRequest("sale/sales", {
      Limit:200,
      PaymentMethodId:1,
      StartSaleDateTime:"2020-04-09T12:00:00Z",
      EndSaleDateTime:"2020-04-09T23:59:00Z"
    }, resp => {
      var data = "";
      resp.on("data", chunk => data += chunk);
      resp.on("end", () => {
        console.log(JSON.parse(data));
        var sales = JSON.parse(data).Sales;
        if (!sales) {
          sales = [];
        }
        for (let i = 0; i < sales.length; i++)
          console.log(sales[i]);
      });
    });
    
    getRequest("sale/products", {}, resp => {
      var data = "";
      resp.on("data", chunk => data += chunk);
      resp.on("end", () => {
        var x = JSON.parse(data).Products;
        if (!x) {
          x = [];
        }
        for (let i = 0; i < x.length; i++)
          console.log(x[i]);
      });
    });
    
    getRequest("sale/services", {}, resp => {
      var data = "";
      resp.on("data", chunk => data += chunk);
      resp.on("end", () => {
        var x = JSON.parse(data).Services;
        if (!x) {
          x = [];
        }
        for (let i = 0; i < x.length; i++)
          console.log(x[i]);
      });
    });
    
    var cart = {
      Test: false,
      ClientId: 100014871,
      Items: [
        {Item: {Type: "Product", Metadata: {Id: "0001"}}, Quantity: 22},
        {Item: {Type: "Product", Metadata: {Id: "0002"}}, Quantity: 6}
      ],
      InStore: true,
      Payments: [
        {
          Type: "Cash",
          Metadata: {
            Amount: 53.52,
            Notes: "Tip"
          }
        }
      ],
      LocationId: 1
      };
      
      postRequest("sale/checkoutshoppingcart", cart, resp => {
      var data = "";
      resp.on("data", chunk => data += chunk);
      resp.on("end", () => {
        console.log(JSON.parse(data));
      });
    });
  }

}

// var report = new CommissionReport();
// report.setStartDate("2020-04-09T00:00:00");
// report.generate().then(staff => console.log(staff));

