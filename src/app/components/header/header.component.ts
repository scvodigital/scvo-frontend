import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
// import { Control } from '@angular/common';

import { Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
// import { MaterializeDirective } from "angular2-materialize";
import { MdSidenav } from "@angular/material";

import { MenuComponent } from '../menu/menu.component';
// import { SearchInputComponent } from "./search-input.component";

// declare var $: any;

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

    @ViewChild('sidenav') sidenav: MdSidenav;

    constructor (private router: Router, private slimLoadingBarService: SlimLoadingBarService) {}

    ngOnInit() {
        // $(window).scroll(function() {
        //     if ($(this).scrollTop() > 1) {
        //         $('header').addClass("scroll");
        //     } else {
        //         $('header').removeClass("scroll");
        //     }
        // });
    }
    //
    // // HACK! Having to do it this way because Materialize does not play well with
    // // our menus. They constantly redraw when I init the sidenav using Materialize
    // // and become unoperable. Can't find anyone online with this problem. Hopefully
    // // it'll get fixed with an update or when we move over to 'material2' from the
    // // Angular team
    // public slidein(panel) {
    //     $('#sidenav-overlay').fadeIn();
    //     $('#mobile-' + panel).removeClass('slide-out').addClass('slide-in');
    // }
    //
    // public slideout() {
    //     $('#sidenav-overlay').fadeOut();
    //     $('.side-panel').removeClass('slide-in').addClass('slide-out');
    // }

    // public searchChanged(term) {
    //     this.router.navigate(['/search'], { queryParams: { s: term.replace(' ', '+') } });
    // }
}
