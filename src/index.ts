// Import node modules
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as stream from 'stream';
import * as url from 'url';

// Import NPM modules
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
const Dot = require('dot-object');
import * as S from 'string';

// Router modules
import { Router, RouteMatch, MenuDictionary, RouterRequest, RouterResponse, RouterConfiguration, HttpVerb } from '@scvo/router';
import { ElasticsearchRouterTask } from '@scvo/router-task-elasticsearch';
import { HandlebarsRouterDestination } from '@scvo/router-destination-handlebars';
import { RedirectRouterDestination } from '@scvo/router-destination-redirect';

// Import internal modules
import { Secrets } from './secrets';
import { DomainMap } from './domain-map';
import { CmsMap } from './cms-map';
import { getMenus } from './menus';
import { fsPdf } from './fs-pdf';


// Setup firebase app
const config = {
    credential: admin.credential.cert(<admin.ServiceAccount>Secrets.configs.default.credential),
    databaseURL: Secrets.configs.default.databaseURL
};
const fb = admin.initializeApp(<admin.AppOptions>config);

// Setup constants
const dot = <any>new Dot('/');
const app = express();
const port = process.env.PORT || 9000;
const localDbPath = path.join(__dirname, 'db.json');
const assetsPath = path.join(__dirname, 'assets/');

// Setup global routers variable
var routers: { [site: string]: Router } = null;

// Setup express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.options('*', cors());
app.use('/assets', express.static(assetsPath));

// Setup express routes
app.get('/favicon.ico', favicon);
app.get('/menuUpdate', menuUpdate);
app.post('/centralAuthLogin', centralAuthLogin);
app.get('/getFsPdf', getFsPdf);
app.get('/reload-sites', clearSitesCache);
app.get('/liveness_check', livenessCheck);
app.get('/readiness_check', readinessCheck);
app.get('*', index);
app.post('*', index);

// Express route handlers
async function index(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    try {
        if (isRegisteredRoute(req.path)) {
            return next();
        }

        await loadRouters();

        var hostname = req.get('host');
        var host = req.hostname;
        var sitename = DomainMap[host] || 'scvo';
        var fullUrl = req.protocol + '://' + hostname + req.originalUrl; 
        fullUrl = fullUrl.replace(/(\/)($|\?)/gi, '$2');

        var site = routers[sitename];

        var headers: any = {};
        for (var key in req.headers) {
          headers[key] = req.headers[key];
        }

        var cookies: any = {};
        for (var key in req.cookies) {
          cookies[key] = req.cookies[key];
        }        

        var request: RouterRequest = {
            url: url.parse(fullUrl),
            fullUrl: fullUrl,
            params: req.query,
            headers: headers,
            cookies: cookies,
            verb: (req.method as HttpVerb),
            body: req.body
        };

        var response = await site.execute(request);

        res.status(response.statusCode || 500);
        res.contentType(response.contentType || 'text/html');

        Object.keys(response.headers).forEach((header) => {
            res.setHeader(header, response.headers[header]);
        });

        res.send(response.body || 'Something went bad');
        res.end();
        
        return next();
    } catch(err) {
        sendError('Failed to execute main route', 500, err, res);
        return;
    }
}
async function menuUpdate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    try {
        var postType = req.body.post_type || null;
        var siteKey = req.query.site || 'scvo';

        if(process.env.devmode || req.query.test || postType === 'nav_menu_item'){
            console.log('UPDATING SITE MENUS:', siteKey);
            var path = '/sites/' + siteKey;

            var contextJson: RouterConfiguration = await getJson<RouterConfiguration>(path); 
            var domain = CmsMap[siteKey] || 'cms.scvo.net';
            var menus: MenuDictionary = await getMenus(domain, contextJson.domains);
            await putJson('/sites/' + siteKey + '/menus', menus);
            res.end();
            return next();
        }else{
            res.end();
            return next();
        }
    } catch(err) {
        sendError('Failed to update menus', 500, err, res);
        return;
    }
};

async function favicon(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    res.send('Naw');
    res.end();
    return next();
}

async function readinessCheck(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    console.log('Readiness Check!');
    res.send('OK');
    res.status(200);
    res.end();
    return next();
}

async function livenessCheck(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    console.log('Liveness Check!');
    res.send('OK');
    res.status(200);
    res.end();
    return next();
}

async function clearSitesCache(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    try {
        Object.keys(routers).forEach((name: string) => {
            delete routers[name];
        });
        routers = null;
        res.send('Sites cache cleared');
        res.end();
        return next();
    } catch(err) {
        sendError('Failed to execute main route', 500, err, res);
        return;
    }
}

async function getFsPdf(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    try {
        var idsVal = req.query.ids || '';
        var ids = idsVal.split(',');
        var subdomain = req.query.subdomain || 'www';
        var title = req.query.title || 'Funding Scotland';
        var subtitle = req.query.subtitle || null;

        var out = <any>await fsPdf(ids, subdomain, title, subtitle);

        res.set('Content-Disposition', 'attachment; filename=download.pdf');
        res.set('Content-Type', 'application/pdf');

        out.s.pipe(res).on('finish', () => {
            res.end();
            return next();
        });
    } catch(err) {
        sendError('Failed to generate PDF', 500, err, res);
        return;
    }
}

async function centralAuthLogin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
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
                var err = new Error("Login domain '" + loginDomainName + "' does not exist");
                sendError("Could not find login domain", 500, err, res);
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
        sendError("Error loading login app", 500, err, res);
        return;
    }

    try {
        var decodedToken: admin.auth.DecodedIdToken = await loginApp.auth().verifyIdToken(idToken);
        console.log('Decoded Token:', decodedToken);
        var loginUser: admin.auth.UserRecord = await loginApp.auth().getUser(decodedToken.uid);
        console.log('Login User:', loginUser);
        var email = loginUser.email;
        var centralUser: admin.auth.UserRecord = await fb.auth().getUserByEmail(email);
        console.log('Central User:', centralUser);
        var centralUid = centralUser.uid;
        var customToken: string = await fb.auth().createCustomToken(centralUid);
        console.log('Custom Token:', customToken);
        res.json({
            customToken: customToken,
            user: centralUser
        });
        res.end();
        return next();
    } catch(err) {
        sendError("Error authorising user", 500, err, res);
        return;
    }
}

function sendError(message: string, code: number, error: any, res: express.Response) {
    var errorResponse = {
        message: message,
        error: error
    };
    try {
        console.error(errorResponse);
        res.status(code);
        res.json(errorResponse);
        res.end();
    } catch(err) {
        console.error('Failed to send error response:', errorResponse);
        return;
    }
}

app.listen(port, function () {
    console.log('Listening on port', port);
})

// Utility functions!
async function loadRouters(): Promise<any> {
    try {
        if (routers && !process.env.devmode) return;

        var sites = await getJson< { [site: string]: RouterConfiguration }>('/app-engine/');
        
        var routerTasks = [
            new ElasticsearchRouterTask({})
        ];

        var routerDestinations = [
            new HandlebarsRouterDestination({}),
            new RedirectRouterDestination()
        ]

        routers = {};

        Object.keys(sites).forEach((name: string) => {
            routers[name] = new Router(sites[name], routerTasks, routerDestinations);
        });
    } catch(err) {
        console.error('Failed to load sites:', err);
        throw err;
    }
}

function registeredRoutes() { 
    return app._router.stack
        .filter(r => r.route && r.route.path && r.route.path !== '*')
        .map(r => r.route.path);
}

function isRegisteredRoute(path) {
    var routes = registeredRoutes();
    return routes.indexOf(path) > -1 || path.startsWith('/assets/');
}

async function getJson<T>(jsonPath: string): Promise<T> {
    if(process.env.devmode){
        try{
            jsonPath = S(jsonPath).chompLeft('/').chompRight('/').s;

            var parts = jsonPath.split('/');
            parts.shift();
            jsonPath = parts.join('/');

            var jsonString = fs.readFileSync(localDbPath).toString();
            var db = JSON.parse(jsonString);
            var json;

            if (jsonPath === '') {
                json = db;
            } else {
                json = dot.pick(jsonPath, db);
            }
            return json;
        }catch(err){
            throw err;
        }
    }else{
        console.log('Getting JSON at path:', jsonPath);
        var obj: admin.database.DataSnapshot = await fb.database().ref(jsonPath).once('value');
        console.log('Got Something at path:', jsonPath);
        if(obj.exists()){
            console.log('Object exists');
            var json = obj.val();
            return json;
        }else{
            console.log('No object at path:', jsonPath);
            throw new Error('Path "' + path + '" not found');
        }
    }
}

async function putJson(jsonPath: string, json: any): Promise<void> {
    if(process.env.devmode){
        try{
            jsonPath = S(jsonPath).chompLeft('/').chompRight('/').s;
            
            var parts = jsonPath.split('/');
            parts.shift();
            jsonPath = parts.join('/');
            
            var jsonString = fs.readFileSync(localDbPath).toString();
            var db = JSON.parse(jsonString);

            if (jsonPath === '') {
                db = json;
            } else {
                dot.set(jsonPath, json, db, false);
            }
            fs.writeFileSync(localDbPath, JSON.stringify(db, null, 4));
            return;
        }catch(err){
            throw err;
        }
    }else{ 
        await fb.database().ref(jsonPath).set(json);
    }
    return;
}
