import { Component, NgZone, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CORE_DIRECTIVES, Control, FORM_DIRECTIVES } from '@angular/common';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import * as rx from 'rxjs';

import { ElasticService } from '../../../../services/elastic.service';

@Component({
    selector: 'search',
    templateUrl: 'app/components/dynamic/search/site/elastic.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
    events: ['newResults'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
    searchText: Control;
    searchTextModel: string;
    results: rx.Observable<any>;
    newResults: EventEmitter<any> = new EventEmitter();

    constructor(private router: Router, private es: ElasticService, private _zone: NgZone) {
        this.searchText = new Control();
        this.results = new rx.Observable<Array<any>>();
    }

    ngOnInit() {
        this.router
        .routerState
        .queryParams
        .subscribe(params => {
            this.searchTextModel = decodeURI(params['s']);
            console.log('Searching for: '+this.searchTextModel);
            this.searchText.updateValue(this.searchTextModel);
            // console.log(this.searchText);

            this._zone.run(() => {
                this.results = this.es.search(this.searchTextModel)
                    .map((esResult: any) => {
                        var results = ((esResult.hits || {}).hits || []);
                        if (results.length > 0) {
                            return results;
                        } else {
                            if (this.searchTextModel && this.searchTextModel.trim())
                                console.log('Nothing was found for search term: '+this.searchTextModel);
                            return [];
                        }
                });
            });

            console.log(this.results);
        });
    }

    handleError(): any {
        console.log("Error in search function");
    }
}
