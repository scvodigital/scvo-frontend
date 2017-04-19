import { Component, OnInit } from '@angular/core';

import { AppService } from '../../../services/app.service';
import { SiteComponent } from '../../../common/base.component';

@Component({
    selector: 'app-menu-list',
    templateUrl: './menu-list.component.html'
})
export class MenuListComponent extends SiteComponent {
    get menuItems(){
        return Object.keys(this.appService.menus);
    }

    constructor(appService: AppService) { super(appService); }

    onSiteLoaded() {

    }
}
