import { Component } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.html',
    styleUrls: ['app/components/shared/header/header.css'],
    providers: [],
    directives: [ROUTER_DIRECTIVES],
    pipes: []
})
export class Header {

    constructor() {}

    ngOnInit() {
        // jQuery(".dropdown-toggle").dropdown();
    }

}
