import { Component, ViewEncapsulation } from '@angular/core';

// import { Angulartics2 } from 'angulartics2';
import { Angulartics2Deprecated } from './services/angulartics2-deprecated';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

import { HeaderComponent, FooterComponent } from './components/shared/shared';

@Component({
    selector: 'scvo-app',
    templateUrl: 'app/app.component.html',
    styles: [require('app/app.component.scss').toString()],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent],
    providers: [Angulartics2GoogleAnalytics, Angulartics2Deprecated],
})
export class AppComponent {
    themeColour: string;

    constructor(public router: Router, angulartics2: Angulartics2Deprecated, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
        router.events.subscribe(event => {
            if(event instanceof NavigationEnd){
                window.scrollTo(0, 0);
            }
        });

        this.themeColour = 'teal';
    }
}
