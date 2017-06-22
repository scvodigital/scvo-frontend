"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var functions = require("firebase-functions");
var Site = require("./site");
var Route = require("./route");
var request = require("request");
var secrets = require('./secrets.json');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.compileSite = functions.database.ref('/sites/{site}/').onWrite(function (event) {
    return new Promise(function (resolve, reject) {
        var siteConfig = event.data.val();
        Site.compileSite(event.params.site, siteConfig).then(function (loaderJs) {
            resolve();
        }).catch(function (err) {
            console.error('Failed to compile site', util.inspect(err, false, null));
            reject(err);
        });
    });
});
exports.updateStaticContentIndex = functions.database.ref('/static-content/{id}/').onWrite(function (event) {
    return new Promise(function (resolve, reject) {
        var id = event.params.id;
        var url = 'http://search.scvo.net/scvo-static-content/update/' + id + '?token=' + secrets.elasticsauceToken;
        request.get(url, function (err, resp, body) {
            if (err) {
                console.error('Failed to call update', err);
                reject(err);
            }
            else {
                console.log(body);
                resolve();
            }
        });
    });
});
exports.loadRoute = functions.https.onRequest(function (req, res) {
    var addressParts = Route.getRouteParts(req.get('referer'));
    res.json(addressParts);
});
//# sourceMappingURL=/home/tonicblue/code/scvo-frontend/firebase/functions/src/index.js.map