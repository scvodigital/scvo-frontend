import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Control } from '@angular/common';

import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { MaterializeDirective } from "angular2-materialize";

import { InputDebounceComponent } from "./search.input.component";
import { MenuItemsComponent } from './menu-items.component';

declare var $: any;

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    // styles: [require('app/components/shared/header/header.component.scss').toString()],
    directives: [ROUTER_DIRECTIVES, InputDebounceComponent, MaterializeDirective, MenuItemsComponent, SlimLoadingBar],
    providers: [MenuItemsComponent],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
    public navigationMenu: Object;

    constructor (private router: Router, private slimLoadingBarService: SlimLoadingBarService, private _menuItems: MenuItemsComponent) {
        this.navigationMenu = _menuItems.navigationMenu;
    }

    ngOnInit() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 1) {
                $('header').addClass("scroll");
            } else {
                $('header').removeClass("scroll");
            }
        });
    }

    public searchChanged(term) {
        this.router.navigate(['/search'], { queryParams: { s: term } });
    }
}
