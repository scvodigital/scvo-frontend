"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var querystring = require("querystring");
var deepExtend = require("deep-extend");
var ua = require("universal-analytics");
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
var RouteRecognizer = require('route-recognizer');
var route_1 = require("./route");
var route_match_1 = require("./route-match");
/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
var Router = /** @class */ (function () {
    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    function Router(context, uaId, uaUid, uaDebug) {
        if (uaId === void 0) { uaId = null; }
        if (uaUid === void 0) { uaUid = null; }
        if (uaDebug === void 0) { uaDebug = false; }
        var _this = this;
        this.context = context;
        this.uaId = uaId;
        this.uaUid = uaUid;
        this.uaDebug = uaDebug;
        this._visitor = null;
        // Setup our route recognizer
        this.routeRecognizer = RouteRecognizer.default ? new RouteRecognizer.default() : new RouteRecognizer();
        // Loop through each route in the current context
        Object.keys(context.routes).forEach(function (routeName) {
            // Create a new Route object
            var route = new route_1.Route(context.routes[routeName], context);
            route.name = routeName;
            if (routeName === '_default') {
                // Treat routes called `_default` as the default handler
                _this.defaultResult = { handler: route, isDynamic: true, params: {} };
            }
            else {
                // Any other route needs to be added to our RouteRecognizer
                if (typeof route.pattern === 'string') {
                    var routeDef = {
                        path: route.pattern,
                        handler: route
                    };
                    _this.routeRecognizer.add([routeDef], { as: routeName });
                }
                else {
                    Object.keys(route.pattern).forEach(function (suffix) {
                        var routeDef = {
                            path: route.pattern[suffix],
                            handler: route
                        };
                        _this.routeRecognizer.add([routeDef], { as: routeName + '_' + suffix });
                    });
                }
            }
        });
    }
    Object.defineProperty(Router.prototype, "visitor", {
        get: function () {
            if (!this.uaId)
                return null;
            if (!this._visitor) {
                if (this.uaDebug) {
                    this._visitor = ua(this.uaId, this.uaUid, { https: true }).debug();
                }
                else {
                    this._visitor = ua(this.uaId, this.uaUid, { https: true });
                }
            }
            return this._visitor;
        },
        enumerable: true,
        configurable: true
    });
    Router.prototype.generateUrl = function (routeName, params) {
        var url = this.routeRecognizer.generate(routeName, params);
        return url;
    };
    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    Router.prototype.execute = function (uriString) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var uri = url.parse(uriString);
            _this.trackRoute(uri.path);
            var recognizedRoutes = _this.routeRecognizer.recognize(uri.path) || [_this.defaultResult];
            var firstResult = recognizedRoutes[0] || _this.defaultResult;
            var handler = firstResult.handler;
            var params = {};
            Object.assign(params, handler.defaultParamsCopy);
            Object.assign(params, firstResult.params);
            var query = querystring.parse(uri.query, handler.queryDelimiter, handler.queryEquals);
            var idFriendlyPath = uri.pathname.replace(/\//g, '_');
            if (idFriendlyPath.startsWith('_')) {
                idFriendlyPath = idFriendlyPath.substr(1);
            }
            deepExtend(params, { query: query, path: idFriendlyPath, uri: uri });
            console.log('[ROUTER], \n\tURL:', uriString, '\n\tMatch:', handler.name, '\n\tParams:', params);
            var routeMatch = new route_match_1.RouteMatch(handler, params, _this.context);
            routeMatch.getResults().then(function () {
                _this.trackDocumentHit(routeMatch.primaryResponse);
                resolve(routeMatch.response);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    Router.prototype.trackRoute = function (path) {
        if (!this.visitor)
            return;
        /*
        this.visitor.pageview(path, (err) => {
            if(err){
                console.error('[UA ' + this.uaId + '] Failed to track route:', path, err);
            }
        });
        */
    };
    Router.prototype.trackDocumentHit = function (results) {
        /*
        if(!this.visitor || !results.hits.hits || results.hits.hits.length === 0) return;
        var hitType = results.hits.total > 1 ? 'Multi' : 'Single';

        results.hits.hits.forEach((hit) => {
            var documentType = hit._type;
            var documentId = hit._id;
            //console.log('TRACK DOCUMENT HIT:', documentType, documentId);
            this.visitor.event('Document Hit', documentType, documentId, (err) => {
                if(err){
                    console.error('[UA ' + this.uaId + '] Failed to track hit:', documentType, documentId, err);
                }else{
                    //console.log('TRACKED DOCUMENT HIT:', documentType, documentId);
                }
            });
        });
        */
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map