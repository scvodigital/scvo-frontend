import { Component, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { Control } from '@angular/common';

import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

import { InputDebounceComponent } from "./search.input.component";
import { MenuItemsComponent } from './menu-items.component';

declare var $: any;

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    // styles: [require('app/components/shared/header/header.component.scss').toString()],
    directives: [ROUTER_DIRECTIVES, InputDebounceComponent, MaterializeDirective, MenuItemsComponent],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
    constructor (private router: Router) {}

    public searchChanged(term) {
        this.router.navigate(['/search'], { queryParams: { s: term } });
    }
}
