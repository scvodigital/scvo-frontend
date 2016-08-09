import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { BreadcrumbComponent, BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { DrupalService } from './services/drupal.service';

import { HeaderComponent, FooterComponent } from './components/shared/shared';
import { MenuItemsComponent } from './components/shared/header/menu-items.component';

@Component({
    selector: 'scvo-app',
    templateUrl: 'app/app.component.html',
    styles: [require('app/app.component.scss').toString()],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent, BreadcrumbComponent],
    providers: [Angulartics2GoogleAnalytics, MenuItemsComponent, DrupalService]
})
export class AppComponent {
    public pathClasses: string;
    public navigationMenu: Object;
    public cmsTags: Object;

    constructor(public router: Router, public angulartics2: Angulartics2, public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics, private breadcrumbService: BreadcrumbService, private _menuItems: MenuItemsComponent, private _drupalService: DrupalService) {
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

        // Set breadcrumb titles
        this.navigationMenu = _menuItems.navigationMenu;
        for (var level1 in this.navigationMenu) {
            breadcrumbService.addFriendlyNameForRoute(this.navigationMenu[level1].path, this.navigationMenu[level1].title);
            for (var level2 in this.navigationMenu[level1].contents) {
                breadcrumbService.addFriendlyNameForRoute(this.navigationMenu[level1].contents[level2].path, this.navigationMenu[level1].contents[level2].title);
                // for (var level3 in this.navigationMenu[level1].contents[level2]) {
                //     // breadcrumbService.addFriendlyNameForRoute(this.navigationMenu[level1].contents[level2].contents[level3].path, this.navigationMenu[level1].contents[level2].contents[level3].title);
                // }
            }
        }

        // Get tags from Drupal
        this.cmsTags = {};
        this._drupalService.request('tags').subscribe(tags => {
            for (var key in tags) {
                var tid = tags[key].tid[0].value;
                var name = tags[key].name[0].value;
                this.cmsTags[tid] = name;
            }
            // console.log(this.cmsTags);
        });
    }
}
