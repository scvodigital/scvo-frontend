// Node imports
import * as stream from 'stream';

// Module imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Router, RouteMatch } from 'scvo-router';

// Internal imports
import { fsPdf } from './fs-pdf';
import { Secrets } from './secrets';

const config = {
    credential: admin.credential.cert(<admin.ServiceAccount>Secrets),
    databaseURL: "https://scvo-net.firebaseio.com"
};

const app = admin.initializeApp(<admin.AppOptions>config);

exports.index = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    console.log('URL:', req.url);
    return new Promise((resolve, reject) => {
        console.log('Fetching goodmoves config');
        app.database().ref('/sites/goodmoves').once('value').then((contextObj: admin.database.DataSnapshot) => {
            var context = contextObj.val();
            console.log('Goodmoves config:', JSON.stringify(context, null, 4));

            console.log('Creating router');
            var router = new Router(context.routes);
            router.execute(req.url).then((routeMatch: RouteMatch) => {
                console.log('RouteMatch:', routeMatch);
                res.json(routeMatch);
                res.end();
                resolve();
            }).catch((err) => {
                console.error('Failed to execute router', err);
                res.json(err);
                res.end();
                reject(err); 
            });
        }).catch((err) => {
            console.error('Failed to get context', err);
            res.json(err);
            res.end();
            reject(err);  
        });        
    }); 
});




// This is only temporarily here while we work out how PDF generation is handled in the future
exports.getFsPdf = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    return new Promise((resolve, reject) => {
        var idsVal = req.query.ids || '';
        var ids = idsVal.split(',');
        var subdomain = req.query.subdomain || 'www'; 
        var title = req.query.title || 'Funding Scotland';
        var subtitle = req.query.subtitle || null;

        fsPdf(ids, subdomain, title, subtitle).then((out: { s: stream.PassThrough, filename: string }) => {
            res.set('Content-Disposition', 'attachment; filename=' + out.filename);
            res.set('Content-Type', 'application/pdf');
            out.s.pipe(res).on('finish', () => {
                res.end();
                resolve();
            });
        }).catch((err) => {
            res.status(500);
            res.json(err);
            res.end();
            reject(err);
        });
    });
});
