import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { BreadcrumbComponent } from 'ng2-breadcrumb/ng2-breadcrumb';

import { HeaderComponent, FooterComponent } from './components/shared/shared';

@Component({
    selector: 'scvo-app',
    templateUrl: 'app/app.component.html',
    styles: [require('app/app.component.scss').toString()],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent, BreadcrumbComponent],
    providers: [Angulartics2GoogleAnalytics]
})
export class AppComponent {
    public pathClasses: string;

    constructor(public router: Router, public angulartics2: Angulartics2, public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
        // On navigation
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // Go to top of page
                window.scrollTo(0, 0);

                // Hide main menu dropdown if still open
                $('.dropdown-content').hide();

                // Set page classes for styling
                this.pathClasses = this.router.url.replace(/\//g, ' ').trim();
            }
        });
    }
}
