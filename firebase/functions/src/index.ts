import * as util from 'util';
import * as functions from 'firebase-functions';
import * as Site from './site';
import * as Route from './route';

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

exports.loadRoute = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    var addressParts = Route.getRouteParts(req.get('referer'));
    res.json(addressParts);
});