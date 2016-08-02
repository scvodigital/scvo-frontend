import { Component, ViewEncapsulation } from '@angular/core';

import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { HeaderComponent, FooterComponent } from './components/shared/shared';

@Component({
    selector: 'scvo-app',
    templateUrl: 'app/app.component.html',
    styles: [require('app/app.component.scss').toString()],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent],
    providers: [Angulartics2GoogleAnalytics],
})
export class AppComponent {
    pathClasses: string;

    constructor(public router: Router, angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
        this.router.events.subscribe(event => {
            // For page navigation (new route)
            if (event instanceof NavigationEnd) {
                // Go to top of page
                window.scrollTo(0, 0);

                $('.dropdown-content').hide();

                // Set page classes for styling
                this.pathClasses = this.router.url.replace(/\//g, ' ').trim();
            }
        });
    }
}
