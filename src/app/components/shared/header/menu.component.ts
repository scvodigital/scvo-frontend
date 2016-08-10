import { Component, Input } from '@angular/core';
import { Control } from '@angular/common';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from 'angular2-materialize';

import { AppService } from '../../../services/app.service';

@Component({
    selector: '[menu]',
    templateUrl: 'app/components/shared/header/menu.component.html',
    providers: [AppService],
    directives: [ROUTER_DIRECTIVES, MaterializeDirective]
})
export class MenuComponent {
    @Input('menu') menuType: string = '';

    public navigationMenu: Object;

    constructor(private _appService: AppService) {
        this.navigationMenu = _appService.navigationMenu;
    }
}
