"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// Module imports
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var Dot = require("dot-object");
// Internal imports
var fs_pdf_1 = require("./fs-pdf");
var context_1 = require("./context");
var secrets_1 = require("./secrets");
var config = {
    credential: admin.credential.cert(secrets_1.Secrets),
    databaseURL: "https://scvo-net.firebaseio.com"
};
var app = admin.initializeApp(config);
var dot = new Dot('/');
exports.index = functions.https.onRequest(function (req, res) {
    return new Promise(function (resolve, reject) {
        var domain = req.hostname.replace(/www\./, '');
        var siteKey = domainMap[domain] ? domainMap[domain] : 'scvo';
        var path = '/sites/' + siteKey;
        getJson(path).then(function (contextJson) {
            var context = new context_1.Context(contextJson);
            context.renderPage(req.url).then(function (html) {
                res.send(html);
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
function getJson(jsonPath) {
    return new Promise(function (resolve, reject) {
        if (process.env.devmode) {
            console.log('In dev mode. loading local db');
            try {
                jsonPath = jsonPath.indexOf('/') === 0 ? jsonPath.substr(1) : jsonPath;
                var filePath = path.join(__dirname, '../test-db/db.json');
                var jsonString = fs.readFileSync(filePath).toString();
                var db = JSON.parse(jsonString);
                var json = dot.pick(jsonPath, db);
                resolve(json);
            }
            catch (err) {
                reject(err);
            }
        }
        else {
            console.log('Not in dev mode, using firebase');
            app.database().ref(jsonPath).once('value').then(function (obj) {
                if (obj.exists()) {
                    var json = obj.val();
                    resolve(json);
                }
                else {
                    reject(new Error('Path "' + path + '" not found'));
                }
            }).catch(function (err) {
                reject(err);
            });
        }
    });
}
var domainMap = {
    "goodmoves.com": "goodmoves",
    "goodmoves.org.uk": "goodmoves",
    "localhost": "scvo",
    "127.0.0.1": "scvo",
    "scvo.net": "scvo",
    "beta.scvo.org.uk": "scvo",
    "beta.scvo.org": "scvo"
};
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