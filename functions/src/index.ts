// Node imports
import * as stream from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as url from 'url';

// Module imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Router, RouteMatch, IMenus, IRouterResponse } from 'scvo-router';
import * as Dot from 'dot-object';
import * as uuid from 'uuid';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

// Internal imports
import { fsPdf } from './fs-pdf';
import { Context } from './context';
import { Secrets } from './secrets';
import { getMenus } from './menus';

const config = {
    credential: admin.credential.cert(<admin.ServiceAccount>Secrets),
    databaseURL: "https://scvo-net.firebaseio.com"
};

const app = admin.initializeApp(<admin.AppOptions>config);
const dot = new Dot('/');

const cp = cookieParser();

exports.index = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    var startTime = +new Date();
    return new Promise((resolve, reject) => {
        userId(req, res, () => { 
            var domain = req.hostname.replace(/www\./, '');
            if (domain === 'localhost') {
                domain = req.get('x-forwarded-host').split(":")[0];
            }
            var siteKey = domainMap[domain] ? domainMap[domain] : 'scvo';
            var path = '/sites/' + siteKey;

            getJson<Context>(path).then((contextJson: Context) => {
                var context = new Context(contextJson, req.cookies.__session);
                var url = req.query.url || req.url;
                
                url = 'https://' + domain + url;

                context.renderPage(url).then((response: IRouterResponse) => {
                    res.contentType(response.contentType);
                    res.status(response.statusCode);
                    res.send(response.contentBody);
                    res.end();
                    var endTime = +new Date();
                    console.log('#### Took', (endTime - startTime), 'ms to complete route', url);
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
});

exports.menuUpdate = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    return new Promise((resolve, reject) => {
        var postType = req.body.post_type || null;
        var siteKey = req.query.site || 'scvo';

        if(process.env.devmode || req.query.test || postType === 'nav_menu_item'){
            console.log('UPDATING SITE MENUS:', siteKey);
            var path = '/sites/' + siteKey;

            getJson<Context>(path).then((contextJson: Context) => {
                var domain = siteCmsMap[siteKey] || 'cms.scvo.net';
                getMenus(domain, contextJson.domains).then((menus: IMenus) => {
                    putJson('/sites/' + siteKey + '/menus', menus).then(() => {
                        res.end();
                        resolve();
                    }).catch((err) => {
                        console.error('Error updating menus:', err);
                        res.json(err);
                        res.end();
                        reject(err);
                    });
                }).catch((err) => {
                    console.error('Error fetching menus:', err);
                    res.json(err);
                    res.end();
                    reject(err);
                });
            }).catch((err) => {
                console.error('Error fetching context:', err);
                res.json(err);
                res.end();
                reject(err);
            });
        }else{
            res.end();
            resolve();
        }
    });
});

function userId(req: functions.Request, res: functions.Response, callback: Function) {
    cp(req, res, () => {
        var userId = req.cookies && req.cookies.__session ? req.cookies.__session : uuid.v4();
        var maxAge = 24 * 60 * 60 * 1000;

        req.cookies.__session = userId;
        res.cookie('__session', userId, { maxAge: maxAge });

        callback(req, res);
    });
}

function putJson(jsonPath: string, json: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if(process.env.devmode){
            try{
                jsonPath = jsonPath.indexOf('/') === 0 ? jsonPath.substr(1) : jsonPath;
                var filePath = path.join(__dirname, '../test-db/db.json');
                var jsonString = fs.readFileSync(filePath).toString();
                var db = JSON.parse(jsonString);
                dot.set(jsonPath, json, db, false);
                fs.writeFileSync(filePath, JSON.stringify(db, null, 4));
                resolve();
            }catch(err){
                reject(err);
            }
        }else{
            app.database().ref(jsonPath).set(json).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }
    });
}

function getJson<T>(jsonPath: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        if(process.env.devmode){
            try{
                jsonPath = jsonPath.indexOf('/') === 0 ? jsonPath.substr(1) : jsonPath;
                var filePath = path.join(__dirname, '../test-db/db.json');
                var jsonString = fs.readFileSync(filePath).toString();
                var db = JSON.parse(jsonString);
                var json = dot.pick(jsonPath, db);
                resolve(json);
            }catch(err){
                reject(err);
            }
        }else{
            app.database().ref(jsonPath).once('value').then((obj: admin.database.DataSnapshot) => {
                if(obj.exists()){
                    var json = obj.val();
                    resolve(json);
                }else{
                    reject(new Error('Path "' + path + '" not found'));
                }
            }).catch((err) => {
                reject(err);
            });
        }
    });
}

const siteCmsMap = {
    "goodmoves": "cms.goodmoves.com",
    "goodhq": "merida.goodhq.org",
    "scvo": "cms.scvo.org"
};

const domainMap = {
    "localhost": "scvo",
    "scvo.local": "scvo",
    "127.0.0.1": "scvo",
    "scvo.net": "scvo",
    "amp.scvo.local": "scvo",
    "amp.scvo.org": "scvo",
    "scvo.org": "scvo",
    "scvo.org.uk": "scvo",
    "test.scvo.org": "scvo",
    "test.scvo.org.uk": "scvo",
    "goodhq.org": "goodhq",
    "scvolabs.org": "goodhq",
    "test.goodhq.org": "goodhq",
    "ghqtest.scvo.org": "goodhq",
    "goodhq.local": "goodhq",
    "humanrightsdeclaration.local": "humanrightsdeclaration",
    "humanrightsdeclaration.scot": "humanrightsdeclaration",
    "test.humanrightsdeclaration.scot": "humanrightsdeclaration",
    "digitalparticipation.local": "digitalparticipation",
    "digitalparticipation.scot": "digitalparticipation",
    "test.digitalparticipation.scot": "digitalparticipation",
    "goodmoves.eu": "goodmoves",
    "goodmoves.be": "goodmoves",
    "goodmoves.com": "goodmoves",
    "goodmoves.scot": "goodmoves",
    "goodmoves.wales": "goodmoves",
    "goodmoves.cymru": "goodmoves",
    "goodmovesjobs.de": "goodmoves",
    "goodmoves.org.uk": "goodmoves",
    "fundingscotland.com": "fundingscotland",
    "test.fundingscotland.com": "fundingscotland",
    "fundingscotland.local": "fundingscotland",
    "scvo-net.firebaseapp.com": "scvo"
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
