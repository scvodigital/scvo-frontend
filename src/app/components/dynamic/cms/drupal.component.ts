import { Component, NgZone, OnInit } from '@angular/core';
import { CORE_DIRECTIVES, Control } from '@angular/common';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import * as rx from 'rxjs';

@Component({
    selector: 'search',
    templateUrl: 'app/components/dynamic/cms/drupal.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})
export class DrupalComponent implements OnInit {

    constructor(private router: Router, private route: ActivatedRoute, private _zone: NgZone) {
    }

    ngOnInit() {
        this.route
        .url
        .subscribe(routeParams => {
            console.log(routeParams[1].path);
        });
    }
}
