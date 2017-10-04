"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module imports
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var scvo_router_1 = require("scvo-router");
// Internal imports
var fs_pdf_1 = require("./fs-pdf");
var secrets_1 = require("./secrets");
var config = {
    credential: admin.credential.cert(secrets_1.Secrets),
    databaseURL: "https://scvo-net.firebaseio.com"
};
var app = admin.initializeApp(config);
exports.index = functions.https.onRequest(function (req, res) {
    console.log('URL:', req.url);
    return new Promise(function (resolve, reject) {
        console.log('Fetching goodmoves config');
        app.database().ref('/sites/goodmoves').once('value').then(function (contextObj) {
            var context = contextObj.val();
            console.log('Goodmoves config:', JSON.stringify(context, null, 4));
            console.log('Creating router');
            var router = new scvo_router_1.Router(context.routes);
            router.execute(req.url).then(function (routeMatch) {
                console.log('RouteMatch:', routeMatch);
                res.json(routeMatch);
                res.end();
                resolve();
            }).catch(function (err) {
                console.error('Failed to execute router', err);
                res.json(err);
                res.end();
                reject(err);
            });
        }).catch(function (err) {
            console.error('Failed to get context', err);
            res.json(err);
            res.end();
            reject(err);
        });
    });
});
// This is only temporarily here while we work out how PDF generation is handled in the future
exports.getFsPdf = functions.https.onRequest(function (req, res) {
    return new Promise(function (resolve, reject) {
        var idsVal = req.query.ids || '';
        var ids = idsVal.split(',');
        var subdomain = req.query.subdomain || 'www';
        var title = req.query.title || 'Funding Scotland';
        var subtitle = req.query.subtitle || null;
        fs_pdf_1.fsPdf(ids, subdomain, title, subtitle).then(function (out) {
            res.set('Content-Disposition', 'attachment; filename=' + out.filename);
            res.set('Content-Type', 'application/pdf');
            out.s.pipe(res).on('finish', function () {
                res.end();
                resolve();
            });
        }).catch(function (err) {
            res.status(500);
            res.json(err);
            res.end();
            reject(err);
        });
    });
});
//# sourceMappingURL=index.js.map