/* tslint:disable */
// Import node modules
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
// Import NPM modules
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as stream from 'stream';
import * as url from 'url';
import * as util from 'util';
import { format } from 'date-fns';

const Dot = require('dot-object');
const hbsFactory = require('clayhandlebars');
import * as S from 'string';

// Router modules
//import {Router, RouteMatch, MenuDictionary, RouterRequest, RouterResponse, RouterConfiguration, HttpVerb} from '@scvo/router';
//import {ElasticsearchRouterTask} from '@scvo/router-task-elasticsearch';
//import {FirebaseAuthRouterTask, FirebaseGetDataRouterTask, FirebaseSetDataRouterTask} from '@scvo/router-task-firebase';
//import {MySQLRouterTask} from '@scvo/router-task-mysql';
//import {TransformRouterTask} from '@scvo/router-task-transform';
//import {HandlebarsRouterDestination} from '@scvo/router-destination-handlebars';
//import {RedirectRouterDestination} from '@scvo/router-destination-redirect';
import {Helpers} from './helpers';

import {Router, RouterConfiguration, RouterRequest, RouterResponse, HttpVerb, RendererHandlebars, TaskElasticsearch, TaskMySQL, TaskRedirect, TaskRenderLayout, TaskFirebaseAuth, TaskFirebaseRtbGet, TaskFirebaseRtbSet} from '@scvo/router';

// Import internal modules
import {SECRETS} from './secrets';
import {ANALYTICS_SECRETS} from './analytics-secrets';
import {DOMAIN_MAP} from './domain-map';
import {CMS_MAP} from './cms-map';
//import {getMenus} from './menus';
import {fsPdf} from './fs-pdf';
import {AnalyticsProcessor, ViewCount} from './analytics';

// Setup firebase app
const config = {
  credential: admin.credential.cert(
      <admin.ServiceAccount>SECRETS.configs.scvo.credential),
  databaseURL: SECRETS.configs.scvo.databaseURL
};
const fb = admin.initializeApp(<admin.AppOptions>config);

// Setup constants
const dot = <any>new Dot('/');
const app = express();
const port = process.env.PORT || 9000;
const localDbPath = path.join(__dirname, '../sites/sites.json');
const assetsPath = path.join(__dirname, 'assets/');

// Setup global routers variable
var routers: {[site: string]: Router}|null = null;

// Setup express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(cookieParser());
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

app.get('/analytics/goodmoves-vacancies', goodmovesVacanciesAnalytics);
app.get('/analytics/goodmoves-vacancy-files', goodmovesVacancyFilesAnalytics);
app.get('/analytics/generic', genericAnalytics);

app.get('*', index);
app.post('*', index);

// Express route handlers
async function index(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  try {
    if (isRegisteredRoute(req.path)) {
      return next();
    }

    await loadRouters();

    var hostname = req.get('host');
    var host = req.hostname;
    var sitename = DOMAIN_MAP[host] || 'scvo';
    var fullUrl = req.protocol + '://' + hostname + req.originalUrl;
    fullUrl = fullUrl.replace(/(\/)($|\?)/gi, '$2');

    // Enforce SSL
    // if (req.protocol == 'http') {
    //  res.redirect(`https://${hostname}${req.originalUrl}`);
    //}

    if (routers === null) {
      return next();
    }

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

    var response = await site.go(request);

    res.status(response.statusCode || 500);
    res.contentType(response.contentType || 'text/html');

    Object.keys(response.headers).forEach((header) => {
      res.setHeader(header, response.headers[header]);
    });

    res.send(response.body || 'Something went bad');
    res.end();

    return next();
  } catch (err) {
    sendError('Failed to execute main route', 500, err, res);
    return;
  }
}
async function menuUpdate(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  try {
    var postType = req.body.post_type || null;
    var siteKey = req.query.site || 'scvo';

    if (process.env.devmode || req.query.test || postType === 'nav_menu_item') {
      console.log('UPDATING SITE MENUS:', siteKey);
      var path = '/sites/' + siteKey;

      var contextJson: RouterConfiguration =
          await getJson<RouterConfiguration>(path);
      var domain = CMS_MAP[siteKey] || 'cms.scvo.net';
      //var menus: MenuDictionary = await getMenus(domain, contextJson.domains);
      await putJson('/sites/' + siteKey + '/menus', {});
      res.end();
      return next();
    } else {
      res.end();
      return next();
    }
  } catch (err) {
    sendError('Failed to update menus', 500, err, res);
    return;
  }
};

async function favicon(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  res.send('Naw');
  res.end();
  return next();
}

async function goodmovesVacanciesAnalytics(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  const analyticsProcessor = new AnalyticsProcessor(
      ANALYTICS_SECRETS.googleCredentials.goodmoves,
      ANALYTICS_SECRETS.salesforceCredentials.scvoProduction);
  await analyticsProcessor.setup();
  let response: any = null;
  let gmHits: ViewCount[] = [];
  let startDate = new Date();
  try {
    if (req.query.year && req.query.month) {
      const year = Number(req.query.year);
      const month = Number(req.query.month) - 1;
      startDate = new Date(year, month, 1);  
    }
  } catch(err) {
    console.error('Failed to parse date from querystring. Using beginning of this month.', err);
    startDate = new Date();
  }
  try {
    console.log('Starting Analytics import of Goodmoves Vacancies for', format(startDate, 'YYYY-MM-DD'));
    gmHits = await analyticsProcessor.getGMHitEvents(startDate);
    response = await analyticsProcessor.updateSalesforce(gmHits);
  } catch (err) {
    response = err;
  }
  res.send(
      '<html><body>' +
      '<h1>File Download Hits</h1>' +
      '<pre>' + util.inspect(gmHits, false, null) + '</pre>' +
      '<h1>Response</h1>' +
      '<pre>' + util.inspect(response, false, null) + '</pre>' +
      '</body></html>');
  return next();
}

async function goodmovesVacancyFilesAnalytics(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  const analyticsProcessor = new AnalyticsProcessor(
      ANALYTICS_SECRETS.googleCredentials.goodmoves,
      ANALYTICS_SECRETS.salesforceCredentials.scvoProduction);
  await analyticsProcessor.setup();
  let response: any = null;
  let gmHits: ViewCount[] = [];
  let startDate = new Date();
  try {

    if (req.query.year && req.query.month) {
      const year = Number(req.query.year);
      const month = Number(req.query.month) - 1;
      startDate = new Date(year, month, 1);  
    }
  } catch(err) {
    console.error('Failed to parse date from querystring. Using beginning of this month.', err);
    startDate = new Date();
  }
  try {
    console.log('Starting Analytics import of Goodmoves Vacancy Files for', format(startDate, 'YYYY-MM-DD'));
    gmHits = await analyticsProcessor.getGMDownloadEvents(startDate);
    response = await analyticsProcessor.updateSalesforce(gmHits);
  } catch (err) {
    response = err;
  }
  res.send(
      '<html><body>' +
      '<h1>File Download Hits</h1>' +
      '<pre>' + util.inspect(gmHits, false, null) + '</pre>' +
      '<h1>Response</h1>' +
      '<pre>' + util.inspect(response, false, null) + '</pre>' +
      '</body></html>');
  return next();
}

async function genericAnalytics(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  console.log('TEST CRON JOB');
  res.send('Not yet implemented');
  return next();
}

async function readinessCheck(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  console.log('Readiness Check!');
  res.send('OK');
  res.status(200);
  res.end();
  return next();
}

async function livenessCheck(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  console.log('Liveness Check!');
  res.send('OK');
  res.status(200);
  res.end();
  return next();
}

async function clearSitesCache(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  try {
    if (routers === null) {
      res.send('Sites cache already cleared');
      res.end();
      return next();
    }
    for (var name in routers) {
      delete routers[name];
    };
    routers = null;
    res.send('Sites cache cleared');
    res.end();
    return next();
  } catch (err) {
    sendError('Failed to execute main route', 500, err, res);
    return;
  }
}

async function getFsPdf(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
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
  } catch (err) {
    sendError('Failed to generate PDF', 500, err, res);
    return;
  }
}

async function centralAuthLogin(
    req: express.Request, res: express.Response,
    next: express.NextFunction): Promise<any> {
  var loginApp;
  var loginDomainName = req.body.loginDomain;
  var idToken = req.body.idToken;

  try {
    admin.apps.forEach((app: any) => {
      if (app.name === loginDomainName) {
        loginApp = app;
      }
    });

    if (!loginApp) {
      if (!SECRETS.configs.hasOwnProperty(loginDomainName)) {
        var err = new Error(
            'Login domain \'' + loginDomainName + '\' does not exist');
        sendError('Could not find login domain', 500, err, res);
        return;
      }

      var config = {
        credential: admin.credential.cert({
          projectId:
              (SECRETS.configs as any)[loginDomainName].credential.project_id,
          clientEmail:
              (SECRETS.configs as any)[loginDomainName].credential.client_email,
          privateKey:
              (SECRETS.configs as any)[loginDomainName].credential.private_key
        }),
        databaseURL: (SECRETS.configs as any)[loginDomainName].databaseURL
      };

      loginApp = admin.initializeApp(<admin.AppOptions>config, loginDomainName);
    }
  } catch (err) {
    sendError('Error loading login app', 500, err, res);
    return;
  }

  try {
    var decodedToken: admin.auth.DecodedIdToken =
        await loginApp.auth().verifyIdToken(idToken);
    console.log('Decoded Token:', decodedToken);
    var loginUser: admin.auth.UserRecord =
        await loginApp.auth().getUser(decodedToken.uid);
    console.log('Login User:', loginUser);
    var email = loginUser.email;
    var centralUser: admin.auth.UserRecord =
        await fb.auth().getUserByEmail(email);
    console.log('Central User:', centralUser);
    var centralUid = centralUser.uid;
    var customToken: string = await fb.auth().createCustomToken(centralUid);
    console.log('Custom Token:', customToken);
    res.json({customToken: customToken, user: centralUser});
    res.end();
    return next();
  } catch (err) {
    sendError('Error authorising user', 500, err, res);
    return;
  }
}

function sendError(
    message: string, code: number, error: any, res: express.Response) {
  var errorResponse = {message: message, error: error};
  try {
    console.error(errorResponse);
    res.status(code);
    res.json(errorResponse);
    res.end();
  } catch (err) {
    console.error('Failed to send error response:', errorResponse);
    return;
  }
}

var server: any = null;
if (process.env.devmode) {
  const keyPath = path.join(__dirname, '../test-cert/server.key');
  const crtPath = path.join(__dirname, '../test-cert/server.crt');

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath),
    requestCert: false,
    rejectUnauthorized: false
  };

  server = https.createServer(options, app).listen(port, () => {
    console.log('Listening securely on port', port);
  });
} else {
  app.listen(port, function() {
    console.log('Listening on port', port);
  });
}

// Utility functions!
async function loadRouters(): Promise<any> {
  try {
    if (routers && !process.env.devmode) return;

    var sites =
        await getJson<{[site: string]: RouterConfiguration}>('/app-engine/');

    var firebaseApps = {};

    var routerTasks = {
      elasticsearch: new TaskElasticsearch(),
      redirect: new TaskRedirect(),
      mysql: new TaskMySQL(SECRETS.mysql),
      renderLayout: new TaskRenderLayout(),
      firebaseAuth: new TaskFirebaseAuth(firebaseApps),
      firebaseRtbGet: new TaskFirebaseRtbGet(firebaseApps),
      firebaseRtbSet: new TaskFirebaseRtbSet(firebaseApps)
    }

    /*
    var routerTasks = [
      new ElasticsearchRouterTask({}),
      new FirebaseAuthRouterTask(SECRETS.configs),
      new FirebaseGetDataRouterTask(SECRETS.configs),
      new FirebaseSetDataRouterTask(SECRETS.configs),
      new MySQLRouterTask(SECRETS.mysql, {}),
      new TransformRouterTask()
    ];

    var routerDestinations =
        [new HandlebarsRouterDestination({}), new RedirectRouterDestination()]
    */

    routers = {};

    for (var name in sites) {
      var siteConfig = sites[name];
      var hbs = hbsFactory();
      Helpers.register(hbs);
      Object.keys(siteConfig.metaData.handlebars.partials).forEach((key) => {
        var template = siteConfig.metaData.handlebars.partials[key];
        hbs.registerPartial(key, template);
      }); 

      var renderers = {
        handlebars: new RendererHandlebars(hbs)
      }
      //routers[name] = new Router(sites[name], routerTasks, routerDestinations);
      routers[name] = new Router(sites[name], routerTasks, renderers);
    };
  } catch (err) {
    console.error('Failed to load sites:', err);
    throw err;
  }
}

function registeredRoutes(): string[] {
  var routes: string[] = [];
  app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path && r.route.path !== '*') {
      routes.push(r.route.path);
    }
  });
  return routes;
}

function isRegisteredRoute(path: string): boolean {
  var routes = registeredRoutes();
  return routes.indexOf(path) > -1 || path.startsWith('/assets/');
}

async function getJson<T>(jsonPath: string): Promise<T> {
  if (process.env.devmode) {
    try {
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
    } catch (err) {
      throw err;
    }
  } else {
    console.log('Getting JSON at path:', jsonPath);
    var obj: admin.database.DataSnapshot =
        await fb.database().ref(jsonPath).once('value');
    console.log('Got Something at path:', jsonPath);
    if (obj.exists()) {
      console.log('Object exists');
      var json = obj.val();
      return json;
    } else {
      console.log('No object at path:', jsonPath);
      throw new Error('Path "' + path + '" not found');
    }
  }
}

async function putJson(jsonPath: string, json: any): Promise<void> {
  if (process.env.devmode) {
    try {
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
    } catch (err) {
      throw err;
    }
  } else {
    await fb.database().ref(jsonPath).set(json);
  }
  return;
}
/* tslint:enable */
