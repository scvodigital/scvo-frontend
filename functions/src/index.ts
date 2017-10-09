// Node imports
import * as stream from 'stream';

// Module imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Router, RouteMatch } from 'scvo-router';

// Internal imports
import { fsPdf } from './fs-pdf';
import { Context } from './context';
import { Secrets } from './secrets';

const config = {
    credential: admin.credential.cert(<admin.ServiceAccount>Secrets),
    databaseURL: "https://scvo-net.firebaseio.com"
};

const app = admin.initializeApp(<admin.AppOptions>config);

exports.index = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    return new Promise((resolve, reject) => {
        var domain = req.hostname.replace(/www\./, '');
        var siteKey = domainMap[domain] ? domainMap[domain] : 'scvo';

        app.database().ref('/sites/' + siteKey).once('value').then((contextObj: admin.database.DataSnapshot) => {
            var contextJson = contextObj.val();
            var context = new Context(contextJson);
            
            context.renderPage(req.url).then((html: string) => {
                res.send(html);
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

const domainMap = {
    "goodmoves.com": "goodmoves",
    "goodmoves.org.uk": "goodmoves",
    "localhost": "scvo",
    "127.0.0.1": "scvo",
    "scvo.net": "scvo",
    "beta.scvo.org.uk": "scvo",
};

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
