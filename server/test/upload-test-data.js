import fs from "fs";

import MindbodyRequest from "../requests.js";
import MindbodyAccess from "../api-manager.js";

const fileName = process.argv.slice(2)[0];

fs.readFile("./" + fileName, "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  try {
    const clientsList = JSON.parse(jsonString);
    var promises = new Array();
    let products;
    let classes;
    let clients;

    //gets authorization and then creates an array of promises that return via the Promise.all()
    MindbodyAccess.getAuth()
      .then((value) => {
        for (let i = 0; i < clientsList.clients.length; i++) {
          promises[i] = MindbodyAccess.postClient(clientsList.clients[i]);
        }
        return Promise.all(promises);
      })
      .then((value) => {
        console.log(value);
        return MindbodyAccess.getClients(
          { "SearchText": "Test"});
      })
      .then((clientResponse) => {
        clients = clientResponse;
        return MindbodyAccess.getClasses(
          {"StartDateTime": "2020-04-01T00:00:00",
            "EndDateTime": "2020-04-08T00:00:00", }
        );
      })
      .then((classResponse) => {
        classes = classResponse;
        promises = new Array();
        for (let i = 0; i < classes.Classes.length && i < clients.Clients.length; i++) {
          let classSignup = {
            "ClientId": clients.Clients[i].Id,
            "ClassId": classes.Classes[i].Id,
          };
          console.log("Added " + clients.Clients[i].FirstName + " " + clients.Clients[i].LastName + " to " + classes.Classes[i].ClassDescription.Name);
          promises[i] = MindbodyAccess.postAddClientToClass(classSignup);
        }
        return Promise.all(promises);
      })
      .then((value) => {
        return MindbodyAccess.getProducts();
      })
      .then((products) => {
        for (let i = 0; i < products.Products.length && i < clients.Clients.length; i++) {
          let checkout = {
            "ClientId": clients.Clients[i].Id,
            "Test": false,
            "Items": [
              {
                "Item": {
                  "Type": "Product",
                  "Metadata": {
                    "Id": products.Products[i].Id
                  },
                },
                "Quantity": i + 1,
              },
              {
                "Item": {
                  "Type": "Service",
                  "Metadata": {
                    "Id": 1421,
                  }
                },
                "DiscountAmount" : 0,
                "Quantity" : 1
              }
            ],
            "Payments": [
              {
                "Type": "Cash",
                "Metadata": {
                  "Amount": 20 * i + 1,
                  "Notes": "Payment"
                }
              }
            ],
            "SendEmail": false,
            "InStore": true,
            "LocationId": 1,
          };
          //console.log(checkout);
          //console.log(checkout.Items[0].Item);
          promises[i] = MindbodyAccess.postCheckoutShoppingCart(checkout);
        }
        return Promise.all(promises);
      })
      .catch((err) => {
        console.log("Error parsing JSON string:", err);
      });
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});
