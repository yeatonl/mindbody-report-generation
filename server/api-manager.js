/* eslint-disable comma-spacing */
/*eslint-disable no-console*/
// const URL_USER_TOKEN = "BASE+usertoken/issue";
// const BASE = "https://api.mindbodyonline.com/public/v6/";
// const URL_CLIENTS = BASE + "client/clients?ClientIds=";
// const URL_LOCATIONS = BASE + "site/locations";
// const URL_SESSIONS = BASE + "site/sessiontypes";
// const URL_APPOINTMENTS = BASE + "appointment/activesessiontimes";
const USERNAME = "Siteowner";
const PASSWORD = "apitest1234";


// fetch(URL_USER_TOKEN, REQUEST_TOKEN)
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     REQUEST_CLIENTS.headers.Authorization = data.AccessToken;
//     fetch(URL_CLIENTS, REQUEST_CLIENTS)
//       .then((response) => {
//         return response.json();
//       })
//       .then((data2) => {
//         //console.log(data2);
//       });
//     REQUEST_LOCATIONS.headers.Authorization = data.AccessToken;
//     // let locationPromise = fetch(URL_LOCATIONS, REQUEST_LOCATIONS)
//     //   .then((response) => {
//     //     return response.json();
//     //   });
//     fetch(URL_SESSIONS, REQUEST_LOCATIONS)
//       .then((response) => {
//         return response.json();
//       })
//       .then((values) => {
//         let allApts = [];
//         for (let i = 0; i < values.SessionTypes.length - 1; i++) {
//           fetch(URL_APPOINTMENTS + "?SessionTypeIds=" + values.SessionTypes[i].Id, REQUEST_LOCATIONS)
//             .then((response) => {
//               return response.json();
//             })
//             .then((data3) => {
//               //console.log(data3); lots
//               allApts[i] = data3;
//             });
//         }
//         logCSV(allApts);/e
//       });
//   });

import MindbodyRequest from "./requests.js";
class mindbodyQueries {
  constructor() {
    this.requestNum = 0;
    this.BASE = "https://api.mindbodyonline.com/public/v6/";
    this.URL_AUTH = this.BASE + "usertoken/issue";
    this.URL_CLIENTS = this.BASE + "client/clients?ClientIds=";
    this.URL_LOCATIONS = this.BASE + "site/locations";
    this.URL_SESSIONS = this.BASE + "site/sessiontypes";
    this.URL_APPOINTMENTS = this.BASE + "appointment/activesessiontimes";
    this.APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
    this.SITEID = "-99";
    this.AUTH_TOKEN = null;
  }

  // Gets authentication
  // Returns a promise that will eventually resolve
  getAuth() {
    var req = new MindbodyRequest(
      this.URL_AUTH,
      this.APIKEY,
      this.SITEID,
      "POST",
      "{'Username': '" + USERNAME + "','Password': '" + PASSWORD + "'}"
    );
    this.requestNum++;
    if (!this.atLimit()) {
      return req.makeRequest();
    }
    return this.returnError("Request limit reached");
  }

  // Gets clients
  // Returns a promise that will eventually resolve
  getClients() {
    var req = new MindbodyRequest(
      this.URL_CLIENTS,
      this.APIKEY,
      this.SITEID,
      "GET",
      ""
    );
    req.addAuth(this.AUTH_TOKEN);
    this.requestNum++;
    if (!this.atLimit()) {
      return req.makeRequest();
    }
    return this.returnError("Request limit reached");
  }

  // May be changed later
  atLimit() {
    if (this.requestNum >= 800) {
      return true;
    }
    return false;
  }

  returnError(errString) {
    return new Promise(() => {
      throw new Error(errString);
    });
  }
}

/* Example code
var x = new mindbodyQueries();
x.getAuth()
  .then((value) => {
    x.AUTH_TOKEN = value.AccessToken;
    return x.getClients();
  })
  .then((value) => {
    console.log(value);
  })
  .catch((m) => {
    console.log(m);
  });
  */



