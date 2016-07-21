import { Component } from '@angular/core';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

@Component({
    selector: 'events',
    templateUrl: 'app/components/dynamic/events/search.component.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective]
})
export class EventSearchComponent {
    private selectedCategory = "";
    private selectedLocation = "";
    private selectedCost = "";
    private selectedMonth = "";

    private categories = [];
    private locations = [];
    private costs = [];
    private months = [];

    constructor() {}

    ngOnInit() {
        window.setTimeout(()=>{
            this.categories = [
                {value:1,name:"Option 1"},
                {value:2,name:"Option 2"},
                {value:3,name:"Option 3"}
            ]
            this.locations = [
                {value:1,name:"Option 1"},
                {value:2,name:"Option 2"},
                {value:3,name:"Option 3"}
            ]
            this.costs = [
                {value:1,name:"Option 1"},
                {value:2,name:"Option 2"},
                {value:3,name:"Option 3"}
            ]
            this.months = [
                {value:1,name:"Option 1"},
                {value:2,name:"Option 2"},
                {value:3,name:"Option 3"}
            ]
        },100);

    }

}
