
import fetch from "node-fetch";
export default class MindbodyRequest {
  constructor(url, apiKey, siteId, verb, body) {
    this.URL = url;
    this.APIKEY = apiKey;
    this.SITEID = siteId;
    this.HEADERS = this.unauthedheaders();
    this.AUTH = null;
    this.VERB = verb;
    this.BODY = body;
  }

  unauthedheaders() {
    return {
      "Content-Type": "application/json",
      "Api-Key": this.APIKEY,
      "SiteId": this.SITEID,
      "User-Agent": "MindBody-reports-Capstone",
    };
  }

  addAuth(auth){
    this.AUTH = auth;
  }

  makeRequest() {
    var headers = this.unauthedheaders();
    if (this.AUTH !== null) {
      headers.Authorization = this.AUTH;
    }
    var request = {
      "method": this.VERB,
      "headers": headers,
    };
    if (this.BODY !== "") {
      request.body = this.BODY;
    }
    var p = fetch(this.URL, request)
      .then((response) => {
        return response.json();
      });
    return p;
  }
}
