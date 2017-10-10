import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Observable, Subject } from 'rxjs/Rx';
import { AngularFireDatabase } from 'angularfire2/database';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch } from 'scvo-router';

@Injectable()
export class RouterService {
    public scvoRouter: ScvoRouter;
    public routeChanged: Subject<RouteMatch> = new Subject<RouteMatch>();

    constructor(private db: AngularFireDatabase, private router: Router) { 
        var routes = (<any>window).contextData.routes;
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
