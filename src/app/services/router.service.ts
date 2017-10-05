import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase } from 'angularfire2/database';

import { Router, IRoutes, IContext } from 'scvo-router';
import * as test from '../../assets/handlebars-helpers';

@Injectable()
export class RouterService {
    public router: Router;

    constructor(db: AngularFireDatabase) { 
        var routesRef = db.object('sites/goodmoves/routes');
        routesRef.valueChanges().subscribe((routes) => {
            console.log('Routes:', routes);
            this.router = new Router(routes);
        });
    }
}
