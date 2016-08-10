import { Component } from '@angular/core';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

@Component({
    selector: 'training',
    templateUrl: 'app/components/dynamic/search/training/elastic-results.component.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective]
})
export class TrainingSearchComponent {
    title: string = 'Training';

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
                {value:1,name:"Events"},
                {value:2,name:"Training"}
            ]
            this.locations = [
                {value:1,name:"Edinburgh"},
                {value:2,name:"Glasgow"},
                {value:3,name:"Other"}
            ]
            this.costs = [
                {value:1,name:"Free"},
                {value:2,name:"Paid"}
            ]
            this.months = [
                {value:1,name:"July 2016"},
                {value:2,name:"August 2016"},
                {value:3,name:"September 2016"},
                {value:3,name:"October 2016"}
            ]
        },100);
    }
}
