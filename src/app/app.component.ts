import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

import { HeaderComponent, FooterComponent } from './components/shared/shared';

@Component({
    selector: 'scvo-app',
    providers: [],
    pipes: [],
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent, MaterializeDirective],
    templateUrl: 'app/app.component.html',
    styleUrls: [require('app/app.component.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    constructor() {}
}
