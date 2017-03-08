import { Component, Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// import { Angulartics2 } from 'angulartics2';
// import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { BreadcrumbComponent } from 'ng2-breadcrumb/ng2-breadcrumb';

import { AppService } from './services/app.service';

import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

declare var $: any;

@Component({
    selector: 'scvo',
    templateUrl: './app.component.html',
    // directives: [HeaderComponent, FooterComponent, BreadcrumbComponent]
    // styles: [require('app/app.styles.scss').toString()],
    // encapsulation: ViewEncapsulation.None,
    // providers: [AppService, Angulartics2GoogleAnalytics],
})
export class AppComponent {
    public pathClasses: string;

    constructor(public router: Router, public _appService: AppService) {
        // Set global variables settings
        this._appService.setGlobals();

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
