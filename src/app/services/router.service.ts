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
        var routesRef = db.object('sites/goodmoves/routes');
        var routesSub = routesRef.valueChanges().subscribe((routes) => {
            console.log('Routes:', routes);
            this.scvoRouter = new ScvoRouter(routes);
            this.trackRoute();
        });
    }

    trackRoute(){
        this.router.events.subscribe((event: any) => {
            if(event instanceof NavigationEnd){
                console.log('NavigationEnd:', event.url);
                this.scvoRouter.execute(event.url).then((routeMatch: RouteMatch) => {
                    this.routeChanged.next(routeMatch);
                });
            }
        });
    }
}
