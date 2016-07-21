import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Control } from '@angular/common';

import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

import { InputDebounceComponent } from "./search.input.component";

declare var $: any;

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    styleUrls: [require('app/components/shared/header/header.component.scss')],
    directives: [ROUTER_DIRECTIVES, InputDebounceComponent, MaterializeDirective],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
    public themeColour: string;

    constructor(private router: Router) {
        //HACK: Can't find the correct Lifecycle hook so just sticking this in a timer because trial and error this way ain't good
        //can work it out after go live when less under pressure
        setTimeout(() => {
            // console.log('Initiating Side Nav');
            $('.button-collapse').sideNav({
                closeOnClick: true,
                edge: 'left',
                menuWidth: 350
            });
        }, 1000);

        this.themeColour = 'teal';
    }

    public searchChanged(term) {
        this.router.navigate(['/search'], { queryParams: { s: term } });
    }
}
