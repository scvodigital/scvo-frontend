import { Component } from '@angular/core';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

@Component({
    selector: 'goodmoves',
    templateUrl: 'app/components/dynamic/search/cjs/elastic-results.component.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective]
})
export class CJSSearchComponent {
    title: string = 'Goodmoves';

    private selectedRole = "";
    private selectedSector = "";
    private selectedRegion = "";
    private selectedStatus = "";

    private roles = [];
    private sectors = [];
    private regions = [];
    private statuses = [];

    constructor() {}

    ngOnInit() {
        window.setTimeout(()=>{
            this.roles = [
                {value:1,name:"Teacher"},
                {value:2,name:"Manager"}
            ]
            this.sectors = [
                {value:1,name:"Arts"},
                {value:2,name:"IT"}
            ]
            this.regions = [
                {value:1,name:"Scotland"},
                {value:2,name:"rUK"}
            ]
            this.statuses = [
                {value:1,name:"Full time"},
                {value:2,name:"Part time"}
            ]
        },100);
    }
}
