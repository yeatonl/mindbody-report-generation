import MindbodyRequest from "./requests.js";
import MindbodyAccess from "./api-manager.js";

var newClient = {
    "FirstName": "Ethan",
    "LastName": "Smith",
    "AddressLine1": "1234 Coast Dr.",
    "State": "NY",
    "City": "New York City",
    "PostalCode": "10026",
    "Email": "example@gmail.com",
    "ReferredBy": "John",
    "BirthDate": "4/14/1992",
    "MobilePhone": "2324673309",
};

const URL = "https://api.mindbodyonline.com/public/v6/client";
const APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
const SITEID = "-99";

var req = new MindbodyRequest();

function addClient(parameters) {
    var request = new MindbodyRequest(
        URL + "/addclient",
        APIKEY,
        SITEID,
        "POST",
        parameters,
    );
    request.addAuth(MindbodyAccess.authToken);
    return request.makeRequest();
}

MindbodyAccess.getAuth()
    .then((value) => {
        MindbodyAccess.authToken = value.AccessToken;
        return addClient(newClient);
    })
    .then((value) => {
        console.log(value);
    })
    .catch((m) => {
        console.log(m);
    });