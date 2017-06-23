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
    console.log('Address parts', addressParts);
    var elasticUrl = 'https://readonly:onlyread@50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io/web-content/';
    if (!addressParts.typeId && !addressParts.querystring) {
        // Static content request
        var docUrl = elasticUrl + 'static-content/' + addressParts.path.replace(/\//gi, '_');
        console.log('Document Url', docUrl);
        request.get(docUrl, function (err, resp, body) {
            if (err) {
                console.error('Error fetching static content', addressParts, err);
                res.json(err);
            }
            else {
                var obj = JSON.parse(body);
                console.log('Document', obj);
                res.json(obj);
            }
        });
    }
    else {
    }
});
//# sourceMappingURL=/home/tonicblue/code/scvo-frontend/firebase/functions/src/index.js.map