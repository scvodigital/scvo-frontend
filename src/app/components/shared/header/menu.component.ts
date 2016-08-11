import { Component, Input } from '@angular/core';
import { Control } from '@angular/common';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from 'angular2-materialize';

import { AppService } from '../../../services/app.service';

@Component({
    selector: '[menu]',
    templateUrl: 'app/components/shared/header/menu.component.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective]
})
export class MenuComponent {
    @Input('menu') menuType: string = '';

    public navigation: Object;

    constructor(private _appService: AppService) {
        this.navigation = this._appService.getNavigation();
    }
}
