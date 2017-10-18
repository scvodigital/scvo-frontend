// Node imports
import * as stream from 'stream';
import * as fs from 'fs';
import * as path from 'path';

// Module imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Router, RouteMatch, IMenus } from 'scvo-router';
import * as Dot from 'dot-object';

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

exports.index = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    return new Promise((resolve, reject) => {
        var domain = req.hostname.replace(/www\./, '');
        var siteKey = domainMap[domain] ? domainMap[domain] : 'scvo';
        var path = '/sites/' + siteKey;

        getJson<Context>(path).then((contextJson: Context) => {
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

exports.menuUpdate = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    return new Promise((resolve, reject) => {
        var postType = req.body.post_type || null;
        var siteKey = req.query.site || 'scvo';
        if(process.env.devmode || postType === 'nav_menu_item'){
            var domain = siteCmsMap[siteKey] || 'cms.scvo.net';
            getMenus(domain).then((menus: IMenus) => {
                console.log('Got menus:', menus);
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
        }else{
            res.end();
            resolve();
        }
    });
});

function putJson(jsonPath: string, json: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if(process.env.devmode){
            console.log('In dev mode, using local db');
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
            console.log('Not in dev mode, using firebase');
            app.database().ref(jsonPath).update(json).then(() => {
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
            console.log('In dev mode, loading local db');
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
            console.log('Not in dev mode, using firebase');
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
    "scvo": "cms.scvo.net",
};

const domainMap = {
    "goodmoves.com": "goodmoves",
    "goodmoves.eu": "goodmoves",
    "goodmoves.scot": "goodmoves",
    "goodmoves.org.uk": "goodmoves",
    "localhost": "scvo",
    "127.0.0.1": "scvo",
    "scvo.net": "scvo",
    "beta.scvo.org.uk": "scvo",
    "beta.scvo.scot": "scvo",
    "beta.scvo.org": "scvo"
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
