import { Component, ViewEncapsulation } from '@angular/core';
// import { Control } from '@angular/common';

// import { Angulartics2 } from 'angulartics2';
import { Angulartics2Deprecated } from './services/angulartics2-deprecated';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

// import { MaterializeDirective } from "angular2-materialize";

import { HeaderComponent, FooterComponent } from './components/shared/shared';

@Component({
    selector: 'scvo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: [require('app/app.component.scss')],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent],
    providers: [Angulartics2GoogleAnalytics, Angulartics2Deprecated],
})
export class AppComponent {
    constructor(public router: Router, angulartics2: Angulartics2Deprecated, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
        router.events.subscribe(event => {
            if(event instanceof NavigationEnd){
                window.scrollTo(0, 0);
            }
        });
    }
}
