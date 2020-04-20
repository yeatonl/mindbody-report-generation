import fs from "fs";
import MindbodyRequest from "../requests.js";
import MindbodyAccess from "../api-manager.js";

const URL = "https://api.mindbodyonline.com/public/v6/client";
const APIKEY = "76af57a017f64fcd9fc16cc5032404a0";
const SITEID = "-99";

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

fs.readFile('./server/test/clients.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    try {
        const clientsList = JSON.parse(jsonString)
        MindbodyAccess.getAuth()
            .then((value) => {
                MindbodyAccess.authToken = value.AccessToken;
            });
        for (let i = 0; i < clientsList['clients'].length; i++) {
            addClient(clientsList['clients'][i]);
        }
    } catch (err) {
        console.log('Error parsing JSON string:', err)
    }
})