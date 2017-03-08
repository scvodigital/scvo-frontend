import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { Control } from '@angular/common';

import { Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { MaterializeDirective } from "angular2-materialize";

import { MenuComponent } from './menu.component';
import { SearchInputComponent } from "./search-input.component";

declare var $: any;

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
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
        this.router.navigate(['/search'], { queryParams: { s: term.replace(' ', '+') } });
    }
}
