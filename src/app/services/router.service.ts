import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Observable, Subject } from 'rxjs/Rx';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch } from 'scvo-router';

@Injectable()
export class RouterService {
    public scvoRouter: ScvoRouter;
    public routeChanged: Subject<RouteMatch> = new Subject<RouteMatch>();
    public scvoContext: IContext;

    _domainStripper: RegExp = null; 
    get domainStripper(): RegExp {
        if(!this._domainStripper){
            var stripDomains = this.scvoContext.domains.map((domain: string) => { return domain.replace(/\./g, '\\.'); });
            var domainRegexString = '((https?)?:\\/\\/)((' + stripDomains.join(')|(') + '))';
            this._domainStripper = new RegExp(domainRegexString, 'ig');
        }
        return this._domainStripper;
    }
    
    constructor(private router: Router) {
        this.scvoContext = (<any>window).contextData;
        var routes = this.scvoContext.routes;
        this.scvoRouter = new ScvoRouter(routes);
        this.trackRoute();
    }

    trackRoute(){
        this.router.events.subscribe((event: any) => {
            if(event instanceof NavigationEnd){
                this.scvoRouter.execute(event.url).then((routeMatch: RouteMatch) => {
                    // This is a hack to allow Angular to take over the pre-rendered site
                    (<any>window).document.querySelector('router-outlet').innerHTML = '';
                    this.routeChanged.next(routeMatch);
                });
            }
        });
    }
}
