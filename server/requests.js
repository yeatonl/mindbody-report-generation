
import fetch from "node-fetch";
export default class MindbodyRequest {
  constructor(url, apiKey, siteId, verb, body) {
    this.url = url;
    this.apiKey = apiKey;
    this.siteId = siteId;
    this.headers = this.unauthedheaders();
    this.auth = null;
    this.verb = verb;
    this.body = body;
  }

  unauthedheaders() {
    return {
      "Content-Type": "application/json",
      "Api-Key": this.apiKey,
      "SiteId": this.siteId,
      "User-Agent": "MindBody-reports-Capstone",
    };
  }

  addAuth(auth) {
    this.auth = auth;
  }

  makeRequest() {
    var headers = this.unauthedheaders();
    if (this.auth != null) {
      headers.Authorization = this.auth;
    }
    var request = {
      "method": this.verb,
      "headers": headers,
    };
    if (this.body !== "") {
      request.body = JSON.stringify(this.body);
    }
    return fetch(this.url, request)
      .then((response) => {
        return response.json();
      }).then((json) => {
        return json;
      });
    //return responsePromise;
  }
}
