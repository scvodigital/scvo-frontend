import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, Control } from '@angular/common';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { ElasticService } from '../../../../services/elastic.service';

@Component({
    selector: 'search',
    templateUrl: 'app/components/dynamic/search/site/elastic-results.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class SiteSearchComponent implements OnInit {
    searchText: Control;
    searchTextModel: string;

    public results: Observable<any>;

    constructor(private router: Router, private es: ElasticService, private cd: ChangeDetectorRef) {
        this.searchText = new Control();
        this.results = new Observable<Array<any>>();
    }

    ngOnInit() {
        this.router
        .routerState
        .queryParams
        .subscribe(params => {
            this.searchTextModel = decodeURI(params['s']);
            if (this.searchTextModel !== '') {
                console.log('Searching for: '+this.searchTextModel);

                this.results = this.es.search(this.searchTextModel)
                    .map((esResult: any) => {
                        var results = ((esResult.hits || {}).hits || []);
                        if (results.length > 0) {
                            // this._results.next(results);
                            return results;
                        } else {
                            if (this.searchTextModel && this.searchTextModel.trim())
                                console.log('Nothing was found for search term: '+this.searchTextModel);
                            return [];
                        }
                    });

                this.cd.markForCheck();

                console.log(this.results);
            }
        });
    }

    handleError(): any {
        console.log("Error in search function");
    }
}
