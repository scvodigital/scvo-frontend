import { Component, Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { TranslatePipe } from './pipes/translate.pipe';

import { AppService } from './services/app.service';

declare var $: any;

@Component({
    selector: 'scvo',
    templateUrl: './app.component.html',
    providers: [TranslatePipe]
})
export class AppComponent {
    public pathClasses: string;

    constructor(public router: Router, public _appService: AppService, private breadcrumbService: BreadcrumbService, private translatePipe: TranslatePipe) {
        // On navigation
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // Go to top of page
                window.scrollTo(0, 0);

                // Hide main menu dropdown if still open
                $('.dropdown-content').hide();

                // Set page classes for styling
                this.pathClasses = this.router.url.replace(/\//g, ' ').trim();
                if (!this.pathClasses) this.pathClasses = 'home';
            }
        });

        breadcrumbService.addCallbackForRouteRegex('.*', breadcrumb => this.translatePipe.transform('title:-'+breadcrumb, 'en'));
    }
}
