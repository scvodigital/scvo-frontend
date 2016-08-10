import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Control } from '@angular/common';

import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';
import { MaterializeDirective } from "angular2-materialize";

import { MenuComponent } from './menu.component';
import { SearchInputComponent } from "./search-input.component";

declare var $: any;

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    // styles: [require('app/components/shared/header/header.component.scss').toString()],
    directives: [ROUTER_DIRECTIVES, MenuComponent, SearchInputComponent, MaterializeDirective, SlimLoadingBar],
    // providers: [MenuComponent],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

    constructor (private router: Router, private slimLoadingBarService: SlimLoadingBarService) {}

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
