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
    console.log('Address parts', addressParts);
    var elasticUrl = 'https://readonly:onlyread@50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io/web-content/';
    if(!addressParts.typeId && !addressParts.querystring){
        // Static content request
        var docUrl = elasticUrl + 'static-content/' + addressParts.path.replace(/\//gi, '_');
        console.log('Document Url', docUrl)
        request.get(docUrl, (err, resp, body) => {
            if(err){
                console.error('Error fetching static content', addressParts, err);
                res.json(err);
            }else{
                var obj = JSON.parse(body);
                console.log('Document', obj);
                res.json(obj);
            }
        });
    }else{

    }
});