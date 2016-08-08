import { Component, ViewEncapsulation } from '@angular/core';

import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { BreadcrumbComponent, BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { HeaderComponent, FooterComponent } from './components/shared/shared';
import { MenuItemsComponent } from './components/shared/header/menu-items.component';

@Component({
    selector: 'scvo-app',
    templateUrl: 'app/app.component.html',
    styles: [require('app/app.component.scss').toString()],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent, BreadcrumbComponent],
    providers: [Angulartics2GoogleAnalytics, MenuItemsComponent]
})
export class AppComponent {
    public pathClasses: string;
    public navigationMenu: Object;

    constructor(public router: Router, public angulartics2: Angulartics2, public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics, private breadcrumbService: BreadcrumbService, private _menuItems: MenuItemsComponent) {
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
    }
}
