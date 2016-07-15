import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Angulartics2 } from 'angulartics2';

@Injectable()
export class Angulartics2Deprecated extends Angulartics2 {
    constructor(location: Location, router: Router) {
        super(location);
        this.trackRouter(location, router);
    }

    trackRouter(location: Location, router: Router) {
        router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                let url = location.path();
                this.trackUrlChange(url, location);
            }
        });
    }
}
