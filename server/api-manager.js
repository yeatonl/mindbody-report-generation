/*eslint-disable comma-spacing */
/*eslint-disable no-console*/

const USERNAME = "";
const PASSWORD = "";

//see commit 52f3c1d0c984db4582830a4ce08b31491cbf4f8e for old code

const BASE = "https://api.mindbodyonline.com/public/v6/";
const URL_AUTH = BASE + "usertoken/issue";
const URL_CLIENTS = BASE + "client/clients?ClientIds=";
const URL_LOCATIONS = BASE + "site/locations";
const URL_SESSIONS = BASE + "site/sessiontypes";
const URL_APPOINTMENTS = BASE + "appointment/activesessiontimes";
const APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
const SITEID = "-99";

import MindbodyRequest from "./requests.js";
class MindbodyQueries {
  constructor() {
    this.requestNum = 0;
    this.authToken = null;
  }

  //gets authentication
  //returns a promise that will eventually resolve
  getAuth() {
    var req = new MindbodyRequest(
      URL_AUTH,
      APIKEY,
      SITEID,
      "POST",
      { "Username": USERNAME,
        "Password": PASSWORD }
    );
    this.requestNum++;
    if (!this.atLimit()) {
      return req.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  //gets clients
  //returns a promise that will eventually resolve
  getClients() {
    var req = new MindbodyRequest(
      URL_CLIENTS,
      APIKEY,
      SITEID,
      "GET",
      ""
    );
    req.addAuth(this.authToken);
    this.requestNum++;
    if (!this.atLimit()) {
      return req.makeRequest();
    }
    return Promise.reject(Error("Request limit reached"));
  }

  //may be changed later
  atLimit() {
    if (this.requestNum >= 800) {
      return true;
    }
    return false;
  }
}

/*example code
var client = new mindbodyQueries();
client.getAuth()
  .then((value) => {
    client.AUTH_TOKEN = value.AccessToken;
    return client.getClients();
  })
  .then((value) => {
    console.log(value);
  })
  .catch((m) => {
    console.log(m);
  });
  */



