import fs from "fs";

import MindbodyRequest from "../requests.js";
import MindbodyAccess from "../api-manager.js";
import { lookup } from "dns";

const fileName = process.argv.slice(2)[0];
const NUMWEEKS = 3;
const WEEK = 7;

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
<<<<<<< HEAD
=======
        return MindbodyAccess.post;
      })
      .then((value) => {
>>>>>>> 2443f7e305d8bef253548bdf148b2cb71c269c8f
        return MindbodyAccess.getClients(
          { "SearchText": "Test"});
      })
      .then((clientResponse) => {
        clients = clientResponse;
        let day = new Date();
        let now = day.toISOString();
        let backtrack = WEEK * NUMWEEKS;
        day.setDate(day.getDate() - backtrack);
        return MindbodyAccess.getClasses(
          {"StartDateTime": day.toISOString(),
            "EndDateTime": now, }
        );
      })
      .then((classResponse) => {
        classes = classResponse;
        let lclass = classes.Classes.length;
        let lclient = clients.Clients.length;
        promises = new Array();
        for (let i = 0; i < lclass && i < lclient; i++) {
          let classSignup = {
            "ClientId": clients.Clients[i].Id,
            "ClassId": classes.Classes[i].Id,
          };
          console.log("Added " + clients.Clients[i].FirstName + " " + clients.Clients[i].LastName + " to " + classes.Classes[i].ClassDescription.Name);
          promises[i] = MindbodyAccess.postAddClientToClass(classSignup);
        }
        return Promise.all(promises);
      })
      .then(() => {
        let lclass = classes.Classes.length;
        let lclient = clients.Clients.length;
        promises = new Array();
        for (let i = 0; i < lclass && i < lclient; i++) {
          if (i % 2 == 0) {
            let classSignup = {
              "ClientId": clients.Clients[i].Id,
              "ClassId": classes.Classes[i].Id,
              "LateCancel": true,
            };
            promises[(lclient < lclass ? lclient - 1 : lclass - 1) + i / 2] = MindbodyAccess.postRemoveClientFromClass(classSignup);
            console.log("Late cancelled " + clients.Clients[i].FirstName + " " + clients.Clients[i].LastName + " from " + classes.Classes[i].ClassDescription.Name);
          }
        }
        return Promise.all(promises);
      })
      .then((value) => {
        return MindbodyAccess.getProducts();
      })
      .then((productResponse) => {
        products = productResponse;
        let lp = products.Products.length;
        let lc = clients.Clients.length;
        for (let i = 0; i < lp && i < lc; i++) {
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
                "Quantity": 1,
              },
            ],
            "Payments": [
              {
                "Type": "Cash",
                "Metadata": {
                  "Amount": products.Products[i].Price,
                  "Notes": "Payment"
                }
              }
            ],
            "SendEmail": false,
            "InStore": true,
            "LocationId": 1,
          };
          console.log(clients.Clients[i].FirstName + " " + clients.Clients[i].LastName + " bought " + products.Products[i].Name);
          //console.log(checkout);
          //console.log(checkout.Items[0].Item);
          promises[i] = MindbodyAccess.postCheckoutShoppingCart(checkout);
        }
        return Promise.all(promises);
      })
      .then((checkouts) => {
        let lp = products.Products.length;
        let lc = clients.Clients.length;
        for (let i = 0; i < lp && i < lc; i++) {
          let checkout = {
            "ClientId": clients.Clients[i].Id,
            "Test": false,
            "Items": [
              {
                "Item": {
                  "Type": "Product",
                  "Metadata": {
                    "Id": products.Products[lp - 1 - i].Id
                  },
                },
                "Quantity": 1,
              },
            ],
            "Payments": [
              {
                "Type": "Cash",
                "Metadata": {
                  "Amount": products.Products[lp - 1 - i].Price,
                  "Notes": "Payment"
                }
              }
            ],
            "SendEmail": false,
            "InStore": true,
            "LocationId": 1,
          };
          console.log(clients.Clients[i].FirstName + " " + clients.Clients[i].LastName + " bought " + products.Products[lp - 1 - i].Name);
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
