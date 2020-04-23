import fs from "fs";
import MindbodyRequest from "../requests.js";
import MindbodyAccess from "../api-manager.js";

//The APIKEY in this file must match the APIKEY in api-manager.js or the upload will fail.

const URL = "https://api.mindbodyonline.com/public/v6/client";
//const APIKEY = "f1b7e16e564246368efb58e3f76e2286"; // jason's API key
const APIKEY = "7db287c206374b2f911ddc918879983d"; //dan's API key. Use it if you really need it
const SITEID = "-99";

const fileName = process.argv.slice(2)[0];

//POST request to add a client via the Mindbody API
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

fs.readFile('./server/test/' + fileName, 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    try {
        const clientsList = JSON.parse(jsonString)
        var promises = new Array();

        //gets authorization and then creates an array of promises that return via the Promise.all()
        MindbodyAccess.getAuth()
            .then((value) => {
                for (let i = 0; i < clientsList['clients'].length; i++) {
                    console.log(clientsList['clients'][i]);
                    promises[i] = addClient(clientsList['clients'][i]);
                }
                return Promise.all(promises);
            })
            .catch((m) => {
                console.log(m);
            });
    } catch (err) {
        console.log('Error parsing JSON string:', err)
    }
})