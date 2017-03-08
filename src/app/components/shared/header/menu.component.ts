import { Component, Input } from '@angular/core';

import { AppService } from '../../../services/app.service';

@Component({
    selector: '[menu]',
    templateUrl: './menu.component.html',
})
export class MenuComponent {
    @Input('menu') menuType: string = '';

    public navigation: Object;

    constructor(private _appService: AppService) {
        this.navigation = this._appService.getNavigation();
    }
}
