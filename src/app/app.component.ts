import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { BreadcrumbComponent } from 'ng2-breadcrumb/ng2-breadcrumb';

import { AppService } from './services/app.service';

import { HeaderComponent, FooterComponent } from './components/shared/shared';

@Component({
    selector: 'scvo',
    templateUrl: 'app/app.component.html',
    styles: [require('app/app.component.scss').toString()],
    encapsulation: ViewEncapsulation.None,
    providers: [AppService, Angulartics2GoogleAnalytics],
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent, BreadcrumbComponent]
})
export class AppComponent {
    public pathClasses: string;

    constructor(public router: Router, public _appService: AppService, public angulartics2: Angulartics2, public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
        // Set global variables settings
        this._appService.setNavigation();
        this._appService.setCategories();
        this._appService.setTags();

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
