//import util from "util";
import MindbodyAccess from "../../api-manager.js";

//to add client visits: sandbox -> classes -> sign in -> search for client -> add
//to add sales: sandbox -> retail -> client search -> add item

export class CommissionReport {
  constructor() {
    this.startDate = "";
    this.endDate = "";
    //a different start date is used to determine all the previous
    //instructors for a client
    this.visitStartDate = "2000-01-01T00:00:00";
    this.sales = {};
    this.visits = {};
    this.products = {};
    this.services = {};
  }

  static get noPriorInstructorKey() {
    return "0";
  }

  setStartDate(date) {
    this.startDate = this.formatDate(date);
  }

  setEndDate(date) {
    this.endDate = this.formatDate(date);
  }

  formatDate(date) {
    if (typeof date === "string") {
      return date;
    }
    var roundedDate = new Date(date.getTime());
    const midnight = 0;
    roundedDate.setHours(midnight);
    roundedDate.setMinutes(midnight);
    roundedDate.setSeconds(midnight);
    roundedDate.setMilliseconds(midnight);
    return roundedDate.toISOString();
  }

  //return a promise for the generated report
  generate() {
    return MindbodyAccess.getAuth().then(() => {
      return this.requestSales()
        .then(this.requestSaleItems.bind(this))
        .then(this.requestVisits.bind(this))
        .then(this.merge.bind(this));
    });
  }

  //return a promise for the revenue of each instructor
  //format: {staff_name: {service_name/product_name: revenue}}
  //^^^ staff_name of 0 is a special value, noPriorInstructorKey
  merge() {
    //var params = {showHidden: false, depth: null};
    //console.log("sales:", util.inspect(this.sales, params));
    //console.log("services:", util.inspect(this.services, params));
    //console.log("products:", util.inspect(this.products, params));
    //console.log("visits:", util.inspect(this.visits, params));

    return new Promise((resolve) => {
      var staff = {};
      var clientIDs = Object.keys(this.visits);
      for (let i = 0; i < clientIDs.length; i++) {
        this.incorporateSales(staff, clientIDs[i]);
      }
      resolve(staff);
    });
  }

  //add sales to staff members
  incorporateSales(staff, clientID) {
    var sales = this.sales[clientID];
    for (let i = 0; i < sales.length; i++) {
      this.incorporatePurchases(staff, sales[i], clientID);
    }
  }

  //add purchases within a sale to staff members
  incorporatePurchases(staff, sale, clientID) {
    var date = Date.parse(sale.SaleDateTime);
    for (let i = 0; i < sale.PurchasedItems.length; i++) {
      var purchase = sale.PurchasedItems[i];
      var staffIDs = this.getPriorInstructors(date, clientID);
      var item = this.getItem(purchase);

      for (let staffID of staffIDs) {
        if (staffID in staff === false) {
          staff[staffID] = {};
        }

        if (item.Id in staff[staffID] === false) {
          staff[staffID][item.name] = item.price / staffIDs.size;
        } else {
          staff[staffID][item.name] += item.price / staffIDs.size;
        }
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
      } else {
        console.warn(`${purchase.BarcodeId} not in products`);
      }
    } else {
      item.name = purchase.Id;
      if (purchase.Id in this.services) {
        item.name = this.services[purchase.Id].Name;
        item.price = this.services[purchase.Id].Price;
      } else {
        console.warn(`${purchase.Id} not in services`);
      }
    }
    return item;
  }

  //return a set of staff IDs that the client visited before a date
  getPriorInstructors(saleDate, clientID) {
    var staffIDs = new Set();
    var visits = this.visits[clientID];
    if (visits) {
      for (let i = 0; i < visits.length; i++) {
        var staffID = visits[i].StaffId;
        var classDate = Date.parse(visits[i].StartDateTime);
        if (saleDate > classDate) {
          staffIDs.add(staffID);
        }
      }
    }
    //still mention purchases even if there was no previous instructor
    if (!staffIDs.size) {
      staffIDs.add(CommissionReport.noPriorInstructorKey);
    }
    return staffIDs;
  }

  //return a promise for all sale items
  requestSaleItems() {
    var serviceIDs = new Set();
    var productIDs = new Set();
    var clientIDs = Object.keys(this.sales);
    for (let i = 0; i < clientIDs.length; i++) {
      var clientID = clientIDs[i];
      var sales = this.sales[clientID];
      for (let j = 0; j < sales.length; j++) {
        var items = sales[j].PurchasedItems;
        for (let k = 0; k < items.length; k++) {
          if (items[k].BarcodeId) {
            productIDs.add(items[k].BarcodeId);
          } else {
            serviceIDs.add(items[k].Id);
          }
        }
      }
    }
    var products = this.requestProducts(Array.from(productIDs));
    var services = this.requestServices(Array.from(serviceIDs));
    return Promise.all([products, services]);
  }

  //return sales for each client from a list of all sales
  //format: {client: sales}
  parseSales(sales) {
    var clients = {};
    if (sales) {
      for (let i = 0; i < sales.length; i++) {
        var clientID = sales[i].ClientId;
        if (clientID in clients === false) {
          clients[clientID] = [];
        }
        clients[clientID].push(sales[i]);
      }
    }
    return clients;
  }

  //return a promise for all product and service sales
  requestSales() {
    var self = this;
    var payload = {
      StartSaleDateTime: this.startDate,
      EndSaleDateTime: this.endDate,
      Limit: 200,
      //for cash payments only: PaymentMethodId: 1
    };
    return MindbodyAccess.getSales(payload).then((data) => {
      self.sales = self.parseSales(data.Sales);
    });
  }

  //return a promise for all visit information using client sales
  requestVisits() {
    var clientVisits = [];
    var clientIDs = Object.keys(this.sales);
    for (let i = 0; i < clientIDs.length; i++) {
      clientVisits.push(this.requestClientVisits(clientIDs[i]));
    }
    return Promise.all(clientVisits);
  }

  //return a promise for visit information of a single client
  requestClientVisits(clientID) {
    var self = this;
    var payload = {
      ClientId: clientID,
      StartDate: this.visitStartDate,
      EndDate: this.endDate
    };
    return MindbodyAccess.getClientVisits(payload).then((data) => {
      self.visits[clientID] = data.Visits;
    });
  }

  //return a promise for service pricing info
  requestServices(services) {
    var self = this;
    var payload = {ServiceIds: services};
    return MindbodyAccess.getServices(payload).then((data) => {
      self.services = self.productListToDict(data.Services);
    });
  }

  //return a promise for product pricing info
  requestProducts(products) {
    var self = this;
    var payload = {ProductIds: products};
    return MindbodyAccess.getProducts(payload).then((data) => {
      self.products = self.productListToDict(data.Products);
    });
  }

  //return a dictionary for easier product lookups
  productListToDict(products) {
    var result = {};
    if (products) {
      for (let i = 0; i < products.length; i++) {
        result[products[i].Id] = products[i];
      }
    }
    return result;
  }
}

//(function () {
//var startDate = new Date();
//startDate.setDate(startDate.getDate() - 1);
//var endDate = new Date();
//endDate.setDate(endDate.getDate() + 1);
//
//var report = new CommissionReport();
//report.setStartDate(startDate);
//report.setEndDate(endDate);
//report.generate().then(staff => console.log(staff));
//})();
