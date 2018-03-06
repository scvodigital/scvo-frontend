// System imports
import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';

// Module imports
import { Results, Result } from 'route-recognizer';
import { SearchResponse } from 'elasticsearch';
import * as deepExtend from 'deep-extend';
import * as ua from 'universal-analytics';
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
const RouteRecognizer = require('route-recognizer');

// Internal imports
import { IRoutes, IRouteMatch, IContext, INamedPattern, IRouteResponse } from './interfaces';
import { Route } from './route';
import { RouteMatch } from './route-match';

/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
export class Router {
    private routeRecognizer: any;
    private defaultResult: Result;

    private _visitor: any = null;
    private get visitor(): any {
        if(!this.uaId) return null;
        if(!this._visitor){
            if(this.uaDebug){
                this._visitor = ua(this.uaId, this.uaUid, {https: true}).debug();
            }else{
                this._visitor = ua(this.uaId, this.uaUid, {https: true});
            }
        }
        return this._visitor;
    }
    
    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    constructor(private context: IContext, private uaId: string = null, private uaUid: string = null, private uaDebug: boolean = false){
        // Setup our route recognizer
        this.routeRecognizer = RouteRecognizer.default ? new RouteRecognizer.default() : new RouteRecognizer();
        // Loop through each route in the current context
        Object.keys(context.routes).forEach((routeName: string) => {
            // Create a new Route object
            var route: Route = new Route(context.routes[routeName], context);
            route.name = routeName;
            if(routeName === '_default'){
                // Treat routes called `_default` as the default handler
                this.defaultResult = { handler: route, isDynamic: true, params: {} };
            }else{
                // Any other route needs to be added to our RouteRecognizer
                if(typeof route.pattern === 'string'){
                    var routeDef = {
                        path: route.pattern,
                        handler: route
                    };
                    this.routeRecognizer.add([routeDef], { as: routeName });
                }else{
                    Object.keys(route.pattern).forEach((suffix: string) => {
                        var routeDef = {
                            path: route.pattern[suffix],
                            handler: route
                        };
                        this.routeRecognizer.add([routeDef], { as: routeName + '_' + suffix });
                    });
                }
            }
        });
    }

    public generateUrl(routeName: string, params: any) {
        var url = this.routeRecognizer.generate(routeName, params);
        return url;
    }

    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    public execute(uriString: string): Promise<IRouteResponse>{
        return new Promise<IRouteResponse>((resolve, reject) => {
            var uri: url.Url = url.parse(uriString);

            this.trackRoute(uri.path);

            var recognizedRoutes: Results = this.routeRecognizer.recognize(uri.path) || [this.defaultResult];
            var firstResult: Result = recognizedRoutes[0] || this.defaultResult;
            var handler: Route = <Route>firstResult.handler;

            var params = {};
            Object.assign(params, handler.defaultParamsCopy);
            Object.assign(params, firstResult.params);

            var query = querystring.parse(uri.query, handler.queryDelimiter, handler.queryEquals);
            var idFriendlyPath = uri.pathname.replace(/\//g, '_');
            if(idFriendlyPath.startsWith('_')){
                idFriendlyPath = idFriendlyPath.substr(1);
            }
            deepExtend(params, { query: query, path: idFriendlyPath, uri: uri });

            console.log('[ROUTER], \n\tURL:', uriString, '\n\tMatch:', handler.name, '\n\tParams:', params);

            var routeMatch = new RouteMatch(handler, params, this.context);

            routeMatch.getResults().then(() => {
                this.trackDocumentHit(routeMatch.primaryResponse);
                resolve(routeMatch.response);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    trackRoute(path: string){
        if(!this.visitor) return;
        /*
        this.visitor.pageview(path, (err) => {
            if(err){
                console.error('[UA ' + this.uaId + '] Failed to track route:', path, err);
            }
        });
        */
    }

    trackDocumentHit(results: SearchResponse<any>) {
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
    }
}
