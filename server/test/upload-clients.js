import fs from "fs";
import MindbodyRequest from "../requests.js";
import MindbodyAccess from "../api-manager.js";

const fileName = process.argv.slice(2)[0];

fs.readFile('./server/test/' + fileName, 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error in upload-clients. File read failed: " + err);
        return;
    }
    try {
        const clientsList = JSON.parse(jsonString)
        var promises = new Array();

        //gets authorization and then creates an array of promises that return via the Promise.all()
        MindbodyAccess.getAuth()
            .then((value) => {
                for (let i = 0; i < clientsList['clients'].length; i++) {
                    console.log("In upload-clients, clientsList['clients'][" + i + "] was: " + clientsList['clients'][i]);
                    promises[i] = MindbodyAccess.postClient(clientsList['clients'][i]);
                }
                return Promise.all(promises);
            })
            .catch((m) => {
                console.log("Error in upload-clients catch block: " + m);
            });
    } catch (err) {
        console.log("Error in upload-clients. Parsing JSON string failed: " + err);
    }
})


