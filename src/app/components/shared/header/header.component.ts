import { Component, Input } from '@angular/core';
// import { FORM_DIRECTIVES, Control } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';

// import { Search } from '../services/search.service';

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    directives: [ROUTER_DIRECTIVES],
})
export class HeaderComponent {

    // @Input() search;

    constructor () {}

}
