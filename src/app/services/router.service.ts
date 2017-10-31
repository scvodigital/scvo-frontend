import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Observable, Subject } from 'rxjs/Rx';
import { CookieService } from 'ngx-cookie';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch } from 'scvo-router';

@Injectable()
export class RouterService {
    public scvoRouter: ScvoRouter;
    public routeChanged: Subject<RouteMatch> = new Subject<RouteMatch>();
    public scvoContext: IContext;
    public currentRoute: RouteMatch = null;
    public loaded: boolean = false;

    _domainStripper: RegExp = null; 
    get domainStripper(): RegExp {
        if(!this._domainStripper){
            var stripDomains = this.scvoContext.domains.map((domain: string) => { return domain.replace(/\./g, '\\.'); });
            var domainRegexString = '((https?)?:\\/\\/)((' + stripDomains.join(')|(') + '))';
            this._domainStripper = new RegExp(domainRegexString, 'ig');
        }
        return this._domainStripper;
    }
    
    constructor(private router: Router, private cookieService: CookieService) {
        this.scvoContext = (<any>window).contextData;
        var routes = this.scvoContext.routes;
        var uid = this.cookieService.get('__session');
        if(uid){
            console.log('GOT UID:', this.scvoContext.uaId, uid);
            this.scvoRouter = new ScvoRouter(routes, this.scvoContext.uaId, uid, true);
        }else{
            this.scvoRouter = new ScvoRouter(routes);
        }
        this.currentRoute = this.scvoContext.route;
        this.trackRoute();
    }

    trackRoute(){
        this.router.events.subscribe((event: any) => {
            if(event instanceof NavigationEnd){
                // HACK: To wait not execute a route on first load as we already have that info
                if(!this.loaded){
                    (<any>window).document.querySelector('router-outlet').innerHTML = '';
                    this.loaded = true;
                    return;
                }
                
                this.scvoRouter.execute(event.url).then((routeMatch: RouteMatch) => {
                    // HACK: To allow Angular to take over the pre-rendered site
                    this.currentRoute = routeMatch;
                    this.routeChanged.next(routeMatch);
                });
            }
        });
    }
}
