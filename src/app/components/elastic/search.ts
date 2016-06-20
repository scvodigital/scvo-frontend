import { Component } from 'angular2/core';
import { Http } from 'angular2/http';
import { Client } from "elasticsearch";
import { ROUTER_DIRECTIVES } from "@angular/router";
import { AutoComplete } from "./autocomplete/autocomplete"

@Component({
    selector: 'search',
    directives: [ROUTER_DIRECTIVES, AutoComplete],
    template: `
    <section>
        <div class="row">
            <div class="col m4">
                <div class="wrapper">
                    <autocomplete (changed)="autocompleteCanged($event)"></autocomplete>
                </div>
            </div>
            <div class="col m8">
                <div *ngIf='!!selectedValue'>
                    <div><strong>Selected item:</strong></div>
                    <br>
                    <i>
                        {{selectedValue}}
                    </i>
                </div>
            </div>
        </div>
    </section>
  `
})

export class Search {
    selectedValue: string;
    constructor() {}
    autocompleteCanged(value) {
        this.selectedValue = JSON.stringify(value);
    }
}
