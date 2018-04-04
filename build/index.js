"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
// Import node modules
var bodyParser = require("body-parser");
var compression = require("compression");
var cors = require("cors");
var https = require("https");
// Import NPM modules
var express = require("express");
var admin = require("firebase-admin");
var fs = require("fs");
var path = require("path");
var url = require("url");
var Dot = require('dot-object');
var S = require("string");
// Router modules
var router_1 = require("@scvo/router");
var router_task_elasticsearch_1 = require("@scvo/router-task-elasticsearch");
var router_destination_handlebars_1 = require("@scvo/router-destination-handlebars");
var router_destination_redirect_1 = require("@scvo/router-destination-redirect");
// Import internal modules
var secrets_1 = require("./secrets");
var domain_map_1 = require("./domain-map");
var cms_map_1 = require("./cms-map");
var menus_1 = require("./menus");
var fs_pdf_1 = require("./fs-pdf");
// Setup firebase app
var config = {
    credential: admin.credential.cert(secrets_1.SECRETS.configs.default.credential),
    databaseURL: secrets_1.SECRETS.configs.default.databaseURL
};
var fb = admin.initializeApp(config);
// Setup constants
var dot = new Dot('/');
var app = express();
var port = process.env.PORT || 9000;
var localDbPath = path.join(__dirname, 'db.json');
var assetsPath = path.join(__dirname, 'assets/');
// Setup global routers variable
var routers = null;
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
function index(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var hostname, host, sitename, fullUrl, site, headers, key, cookies, key, request, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (isRegisteredRoute(req.path)) {
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, loadRouters()];
                case 1:
                    _a.sent();
                    hostname = req.get('host');
                    host = req.hostname;
                    sitename = domain_map_1.DOMAIN_MAP[host] || 'scvo';
                    fullUrl = req.protocol + '://' + hostname + req.originalUrl;
                    fullUrl = fullUrl.replace(/(\/)($|\?)/gi, '$2');
                    if (routers === null) {
                        return [2 /*return*/, next()];
                    }
                    site = routers[sitename];
                    headers = {};
                    for (key in req.headers) {
                        headers[key] = req.headers[key];
                    }
                    cookies = {};
                    for (key in req.cookies) {
                        cookies[key] = req.cookies[key];
                    }
                    request = {
                        url: url.parse(fullUrl),
                        fullUrl: fullUrl,
                        params: req.query,
                        headers: headers,
                        cookies: cookies,
                        verb: req.method,
                        body: req.body
                    };
                    return [4 /*yield*/, site.execute(request)];
                case 2:
                    response = _a.sent();
                    res.status(response.statusCode || 500);
                    res.contentType(response.contentType || 'text/html');
                    Object.keys(response.headers).forEach(function (header) {
                        res.setHeader(header, response.headers[header]);
                    });
                    res.send(response.body || 'Something went bad');
                    res.end();
                    return [2 /*return*/, next()];
                case 3:
                    err_1 = _a.sent();
                    sendError('Failed to execute main route', 500, err_1, res);
                    return [2 /*return*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function menuUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var postType, siteKey, path, contextJson, domain, menus, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    postType = req.body.post_type || null;
                    siteKey = req.query.site || 'scvo';
                    if (!(process.env.devmode || req.query.test || postType === 'nav_menu_item')) return [3 /*break*/, 4];
                    console.log('UPDATING SITE MENUS:', siteKey);
                    path = '/sites/' + siteKey;
                    return [4 /*yield*/, getJson(path)];
                case 1:
                    contextJson = _a.sent();
                    domain = cms_map_1.CMS_MAP[siteKey] || 'cms.scvo.net';
                    return [4 /*yield*/, menus_1.getMenus(domain, contextJson.domains)];
                case 2:
                    menus = _a.sent();
                    return [4 /*yield*/, putJson('/sites/' + siteKey + '/menus', menus)];
                case 3:
                    _a.sent();
                    res.end();
                    return [2 /*return*/, next()];
                case 4:
                    res.end();
                    return [2 /*return*/, next()];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    sendError('Failed to update menus', 500, err_2, res);
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
;
function favicon(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.send('Naw');
            res.end();
            return [2 /*return*/, next()];
        });
    });
}
function readinessCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Readiness Check!');
            res.send('OK');
            res.status(200);
            res.end();
            return [2 /*return*/, next()];
        });
    });
}
function livenessCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Liveness Check!');
            res.send('OK');
            res.status(200);
            res.end();
            return [2 /*return*/, next()];
        });
    });
}
function clearSitesCache(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var name;
        return __generator(this, function (_a) {
            try {
                if (routers === null) {
                    res.send('Sites cache already cleared');
                    res.end();
                    return [2 /*return*/, next()];
                }
                for (name in routers) {
                    delete routers[name];
                }
                ;
                routers = null;
                res.send('Sites cache cleared');
                res.end();
                return [2 /*return*/, next()];
            }
            catch (err) {
                sendError('Failed to execute main route', 500, err, res);
                return [2 /*return*/];
            }
            return [2 /*return*/];
        });
    });
}
function getFsPdf(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var idsVal, ids, subdomain, title, subtitle, out, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    idsVal = req.query.ids || '';
                    ids = idsVal.split(',');
                    subdomain = req.query.subdomain || 'www';
                    title = req.query.title || 'Funding Scotland';
                    subtitle = req.query.subtitle || null;
                    return [4 /*yield*/, fs_pdf_1.fsPdf(ids, subdomain, title, subtitle)];
                case 1:
                    out = _a.sent();
                    res.set('Content-Disposition', 'attachment; filename=download.pdf');
                    res.set('Content-Type', 'application/pdf');
                    out.s.pipe(res).on('finish', function () {
                        res.end();
                        return next();
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    sendError('Failed to generate PDF', 500, err_3, res);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function centralAuthLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var loginApp, loginDomainName, idToken, err, config, decodedToken, loginUser, email, centralUser, centralUid, customToken, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loginDomainName = req.body.loginDomain;
                    idToken = req.body.idToken;
                    try {
                        admin.apps.forEach(function (app) {
                            if (app.name === loginDomainName) {
                                loginApp = app;
                            }
                        });
                        if (!loginApp) {
                            if (!secrets_1.SECRETS.configs.hasOwnProperty(loginDomainName)) {
                                err = new Error('Login domain \'' + loginDomainName + '\' does not exist');
                                sendError('Could not find login domain', 500, err, res);
                                return [2 /*return*/];
                            }
                            config = {
                                credential: admin.credential.cert({
                                    projectId: secrets_1.SECRETS.configs[loginDomainName].credential.project_id,
                                    clientEmail: secrets_1.SECRETS.configs[loginDomainName].credential.client_email,
                                    privateKey: secrets_1.SECRETS.configs[loginDomainName].credential.private_key
                                }),
                                databaseURL: secrets_1.SECRETS.configs[loginDomainName].databaseURL
                            };
                            loginApp = admin.initializeApp(config, loginDomainName);
                        }
                    }
                    catch (err) {
                        sendError('Error loading login app', 500, err, res);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, loginApp.auth().verifyIdToken(idToken)];
                case 2:
                    decodedToken = _a.sent();
                    console.log('Decoded Token:', decodedToken);
                    return [4 /*yield*/, loginApp.auth().getUser(decodedToken.uid)];
                case 3:
                    loginUser = _a.sent();
                    console.log('Login User:', loginUser);
                    email = loginUser.email;
                    return [4 /*yield*/, fb.auth().getUserByEmail(email)];
                case 4:
                    centralUser = _a.sent();
                    console.log('Central User:', centralUser);
                    centralUid = centralUser.uid;
                    return [4 /*yield*/, fb.auth().createCustomToken(centralUid)];
                case 5:
                    customToken = _a.sent();
                    console.log('Custom Token:', customToken);
                    res.json({ customToken: customToken, user: centralUser });
                    res.end();
                    return [2 /*return*/, next()];
                case 6:
                    err_4 = _a.sent();
                    sendError('Error authorising user', 500, err_4, res);
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function sendError(message, code, error, res) {
    var errorResponse = { message: message, error: error };
    try {
        console.error(errorResponse);
        res.status(code);
        res.json(errorResponse);
        res.end();
    }
    catch (err) {
        console.error('Failed to send error response:', errorResponse);
        return;
    }
}
var server = null;
if (process.env.devmode) {
    var keyPath = path.join(__dirname, '../test-cert/server.key');
    var crtPath = path.join(__dirname, '../test-cert/server.crt');
    var options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(crtPath),
        requestCert: false,
        rejectUnauthorized: false
    };
    server = https.createServer(options, app).listen(port, function () {
        console.log('Listening securely on port', port);
    });
}
else {
    app.listen(port, function () {
        console.log('Listening on port', port);
    });
}
// Utility functions!
function loadRouters() {
    return __awaiter(this, void 0, void 0, function () {
        var sites, routerTasks, routerDestinations, name, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (routers && !process.env.devmode)
                        return [2 /*return*/];
                    return [4 /*yield*/, getJson('/app-engine/')];
                case 1:
                    sites = _a.sent();
                    routerTasks = [new router_task_elasticsearch_1.ElasticsearchRouterTask({})];
                    routerDestinations = [new router_destination_handlebars_1.HandlebarsRouterDestination({}), new router_destination_redirect_1.RedirectRouterDestination()];
                    routers = {};
                    for (name in sites) {
                        routers[name] = new router_1.Router(sites[name], routerTasks, routerDestinations);
                    }
                    ;
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    console.error('Failed to load sites:', err_5);
                    throw err_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function registeredRoutes() {
    return app._router.stack
        .filter(function (r) { return r.route && r.route.path && r.route.path !== '*'; })
        .map(function (r) { r.route.path; });
}
function isRegisteredRoute(path) {
    var routes = registeredRoutes();
    return routes.indexOf(path) > -1 || path.startsWith('/assets/');
}
function getJson(jsonPath) {
    return __awaiter(this, void 0, void 0, function () {
        var parts, jsonString, db, json, obj, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!process.env.devmode) return [3 /*break*/, 1];
                    try {
                        jsonPath = S(jsonPath).chompLeft('/').chompRight('/').s;
                        parts = jsonPath.split('/');
                        parts.shift();
                        jsonPath = parts.join('/');
                        jsonString = fs.readFileSync(localDbPath).toString();
                        db = JSON.parse(jsonString);
                        if (jsonPath === '') {
                            json = db;
                        }
                        else {
                            json = dot.pick(jsonPath, db);
                        }
                        return [2 /*return*/, json];
                    }
                    catch (err) {
                        throw err;
                    }
                    return [3 /*break*/, 3];
                case 1:
                    console.log('Getting JSON at path:', jsonPath);
                    return [4 /*yield*/, fb.database().ref(jsonPath).once('value')];
                case 2:
                    obj = _a.sent();
                    console.log('Got Something at path:', jsonPath);
                    if (obj.exists()) {
                        console.log('Object exists');
                        json = obj.val();
                        return [2 /*return*/, json];
                    }
                    else {
                        console.log('No object at path:', jsonPath);
                        throw new Error('Path "' + path + '" not found');
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function putJson(jsonPath, json) {
    return __awaiter(this, void 0, void 0, function () {
        var parts, jsonString, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!process.env.devmode) return [3 /*break*/, 1];
                    try {
                        jsonPath = S(jsonPath).chompLeft('/').chompRight('/').s;
                        parts = jsonPath.split('/');
                        parts.shift();
                        jsonPath = parts.join('/');
                        jsonString = fs.readFileSync(localDbPath).toString();
                        db = JSON.parse(jsonString);
                        if (jsonPath === '') {
                            db = json;
                        }
                        else {
                            dot.set(jsonPath, json, db, false);
                        }
                        fs.writeFileSync(localDbPath, JSON.stringify(db, null, 4));
                        return [2 /*return*/];
                    }
                    catch (err) {
                        throw err;
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, fb.database().ref(jsonPath).set(json)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/* tslint:enable */
//# sourceMappingURL=index.js.map