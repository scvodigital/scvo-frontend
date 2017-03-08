import { Component } from '@angular/core';

@Component({
    selector: 'goodmoves',
    templateUrl: './elastic-results.component.html'
})
export class CJSSearchComponent {
    title: string = 'CJS';

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
