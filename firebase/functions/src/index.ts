import * as util from 'util';
import * as functions from 'firebase-functions';
import * as Site from './site';
import * as Route from './route';
import * as request from 'request';

const secrets = require('./secrets.json');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.compileSite = functions.database.ref('/sites/{site}/').onWrite((event: functions.Event<functions.database.DeltaSnapshot>) => {
    return new Promise((resolve, reject) => {
        var siteConfig = event.data.val();
        Site.compileSite(event.params.site, <Site.ISiteConfig>siteConfig).then((loaderJs) => {
            resolve()
        }).catch((err) => {
            console.error('Failed to compile site', util.inspect(err, false, null));
            reject(err);
        });
    });
});

exports.updateStaticContentIndex = functions.database.ref('/static-content/{id}/').onWrite((event: functions.Event<functions.database.DeltaSnapshot>) => {
    return new Promise((resolve, reject) => {
        var id = event.params.id;
        var url = 'http://search.scvo.net/scvo-static-content/update/' + id + '?token=' + secrets.elasticsauceToken;
        request.get(url, (err, resp, body) => {
            if(err){
                console.error('Failed to call update', err);
                reject(err);
            }else{
                console.log(body);
                resolve();
            }
        });
    });
});

exports.loadRoute = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    var addressParts = Route.getRouteParts(req.get('referer'));
    console.log(addressParts);
    res.json(addressParts);
});