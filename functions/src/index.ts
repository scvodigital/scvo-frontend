// Node imports
import * as stream from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as url from 'url';

// Module imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Router, RouteMatch, IMenus, IRouterResponse, IContext } from 'scvo-router';
import { RouterTask as ElasticsearchRouterTask } from 'router-task-elasticsearch';
import * as Dot from 'dot-object';
import * as uuid from 'uuid';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as Cors from 'cors';

// Internal imports
import { fsPdf } from './fs-pdf';
import { Context } from './context';
import { Secrets } from './secrets';
import { getMenus } from './menus';

const config = {
    credential: admin.credential.cert(<admin.ServiceAccount>Secrets.configs.default.credential),
    databaseURL: Secrets.configs.default.databaseURL
};

const app = admin.initializeApp(<admin.AppOptions>config);
const dot = new Dot('/');

const cors = Cors({ origin: true });

export let index = functions.https.onRequest((req: functions.Request, res: functions.Response) => indexHandler(req, res));
export let menuUpdate = functions.https.onRequest((req: functions.Request, res: functions.Response) => menuUpdateHandler(req, res));

async function indexHandler(req: functions.Request, res: functions.Response): Promise<any> {
    var startTime = +new Date();
    var domain = req.hostname.replace(/www\./, '');
    if (domain === 'localhost') {
        domain = req.get('x-forwarded-host').split(":")[0];
    }
    var siteKey = domainMap[domain] ? domainMap[domain] : 'scvo';
    var path = '/sites/' + siteKey;

    var contextJson = await getJson<Context>(path);
    var routerTasks = [
        new ElasticsearchRouterTask({}),
    ];

    var router = new Router(contextJson, routerTasks);
    var url = req.query.url || req.url;

    url = 'https://' + domain + url;
    
    var response: IRouterResponse = await router.execute(url);

    res.contentType(response.contentType);
    res.status(response.statusCode);
    res.send(response.contentBody);
    res.end();

    var endTime = +new Date();
    console.log('#### Took', (endTime - startTime), 'ms to complete route', url);
    return;
}

async function menuUpdateHandler(req: functions.Request, res: functions.Response): Promise<void> {
    var postType = req.body.post_type || null;
    var siteKey = req.query.site || 'scvo';

    if(process.env.devmode || req.query.test || postType === 'nav_menu_item'){
        console.log('UPDATING SITE MENUS:', siteKey);
        var path = '/sites/' + siteKey;

        var contextJson: IContext = await getJson<Context>(path);
        var domain = siteCmsMap[siteKey] || 'cms.scvo.net';
        var menus: IMenus = await getMenus(domain, contextJson.domains);
        await putJson('/sites/' + siteKey + '/menus', menus);
        res.end();
        return;
    }else{
        res.end();
        return;
    }
}

async function putJson(jsonPath: string, json: any): Promise<void> {
    if(process.env.devmode){
        try{
            jsonPath = jsonPath.indexOf('/') === 0 ? jsonPath.substr(1) : jsonPath;
            var filePath = path.join(__dirname, '../test-db/db.json');
            var jsonString = fs.readFileSync(filePath).toString();
            var db = JSON.parse(jsonString);
            dot.set(jsonPath, json, db, false);
            fs.writeFileSync(filePath, JSON.stringify(db, null, 4));
            return;
        }catch(err){
            throw err;
        }
    }else{
        await app.database().ref(jsonPath).set(json);
        return;
    }
}

async function getJson<T>(jsonPath: string): Promise<T> {
    if (process.env.devmode) {
        try {
            jsonPath = jsonPath.indexOf('/') === 0 ? jsonPath.substr(1) : jsonPath;
            var filePath = path.join(__dirname, '../test-db/db.json');
            var jsonString = fs.readFileSync(filePath).toString();
            var db = JSON.parse(jsonString);
            var json = dot.pick(jsonPath, db);
            return json;
        } catch(err) {
            throw err;
        }
    } else {
        var obj: admin.database.DataSnapshot = await app.database().ref(jsonPath).once('value');
        if (obj.exists()) {
            var json = obj.val();
            return json;
        } else {
            throw new Error('Path "' + path + '" not found');
        }
    }
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
    "scvo-sites.firebaseapp.com": "scvo",
    "scvo-net.firebaseapp.com": "scvo",
    "auth.local": "auth",
    "test.local": "test",
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

import * as cookie from 'cookie';

function checkUser(req, res, callback) {
    var cookies = req.get('cookie');
    console.log('#### CHECKUSER -> Cookies:', cookies);
    var parsed = cookie.parse(cookies);
    var idToken = parsed.__session;
    app.auth().verifyIdToken(idToken).then((decoded: admin.auth.DecodedIdToken) => {
        console.log('#### CHECKUSER -> User:', decoded);
        callback(null, decoded);
    }).catch((err) => {
        callback(err, null);
    });
}

exports.headersTest = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    cors(req, res, () => {
        checkUser(req, res, (err, user) => {
            return new Promise((resolve, reject) => {
                console.log('#### HEADERSTEST -> User:', util.inspect(user, false, 3, true));
                var response = {
                    headers: req.headers,
                    user: user
                };
                res.json(response);
                res.end();
                resolve();
            });
        });
    });
});

exports.centralAuthLogin = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
    cors(req, res, () => {
        return new Promise((resolve, reject) => {
            var loginApp;
            var loginDomainName = req.body.loginDomain;
            var idToken = req.body.idToken;
            
            try {
                admin.apps.forEach((app: admin.app.App) => {
                    if (app.name === loginDomainName) {
                        loginApp = app;
                    }
                });

                if (!loginApp) {
                    if (!Secrets.configs.hasOwnProperty(loginDomainName)) {
                        sendError("Could not find login domain", 500, new Error("Login domain '" + loginDomainName + "' does not exist"));
                        return;
                    }

                    var config = {
                        credential: admin.credential.cert({
                            projectId: Secrets.configs[loginDomainName].credential.project_id,
                            clientEmail: Secrets.configs[loginDomainName].credential.client_email,
                            privateKey: Secrets.configs[loginDomainName].credential.private_key     
                        }),
                        databaseURL: Secrets.configs[loginDomainName].databaseURL
                    };

                    loginApp = admin.initializeApp(<admin.AppOptions> config, loginDomainName);
                }
            } catch(err) {
                sendError("Error loading login app", 500, err);
                return;
            }

            console.log("#### AUTH -> Verifying token", idToken);
            loginApp.auth().verifyIdToken(idToken).then((decodedToken: admin.auth.DecodedIdToken) => {
                console.log("#### AUTH -> Token verified", decodedToken);
                console.log("#### AUTH -> Finding user info on", loginDomainName);
                loginApp.auth().getUser(decodedToken.uid).then((loginUser: admin.auth.UserRecord) => {
                    console.log("#### AUTH -> User info found", loginUser);
                    var email = loginUser.email;
                    console.log("#### AUTH -> Finding user with email", email, "in central user list");
                    app.auth().getUserByEmail(email).then((centralUser: admin.auth.UserRecord) => {
                        console.log("#### AUTH -> User found", centralUser);
                        var centralUid = centralUser.uid;
                        console.log("#### AUTH -> Creating custom token for user with Id", centralUid);
                        app.auth().createCustomToken(centralUid).then((customToken: string) => {
                            console.log("#### AUTH -> Custom token created:", customToken);
                            var maxAge = 24 * 60 * 60 * 1000;
                            res.cookie('__session', customToken, { maxAge: maxAge });
                            res.json({
                                customToken: customToken,
                                user: centralUser
                            });
                            res.end();
                            resolve();
                        }).catch((err) => {
                            sendError("Could not login to central account '" + email + "' (" + centralUid + ")", 403, err); 
                        });
                    }).catch((err) => {
                        sendError("Could not find user '" + email + "' in central domain", 403, err);  
                    });
                }).catch((err) => {
                    sendError("Could not find user in '" + loginDomainName + "'", 500, err);       
                });;        
            }).catch((err) => {
                sendError("Failed to verify token", 403, err);
            });

            function sendError(message: string, code: number, error: any) {
                console.error(message, '->', error);
                res.status(code);
                res.json({
                    message: message,
                    error: error
                });
                res.end();
                resolve();
            }
        });
    }); 
});

const loginDomainConfigurations = {
    fundingscotland: {
        "apiKey": "AIzaSyAdecxsam31jfcXk5riBTKFjjZN6H68FMI",
        "authDomain": "scvo-auth-fs.firebaseapp.com",
        "databaseURL": "https://scvo-auth-fs.firebaseio.com",
        "projectId": "scvo-auth-fs",
        "storageBucket": "scvo-auth-fs.appspot.com",
        "messagingSenderId": "35877130739"
    },
    goodmoves: {
        "apiKey": "AIzaSyAuGAacoIdUgbtfI42UXTHDosMS4pP5Teg",
        "authDomain": "goodmoves-frontend.firebaseapp.com",
        "databaseURL": "https://goodmoves-frontend.firebaseio.com",
        "projectId": "goodmoves-frontend",
        "storageBucket": "goodmoves-frontend.appspot.com",
        "messagingSenderId": "639831727728"
    }
}
