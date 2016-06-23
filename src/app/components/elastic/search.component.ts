import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Control } from '@angular/common';
import { URLSearchParams, Jsonp } from '@angular/http';

import * as rx from 'rxjs';

// import { SearchService } from '../../services/search.service';
import { ElasticSearchService } from '../../services/elasticsearch.service';

@Component({
    selector: 'search',
    templateUrl: 'app/components/elastic/search.component.html',
    styleUrls: [require('app/components/elastic/search.component.scss')],
    providers: [ElasticSearchService],
})
export class SearchComponent {
    searchTerm: string;

    results: rx.Observable<any>;
    searchResults: Array<any>;
    countResults: number;
    resultsFound: boolean = false;

    constructor(private router: Router, private _elasticSearchService: ElasticSearchService) {}

    ngOnInit() {
        // Get query parameters
        this.router
        .routerState
        .queryParams
        .subscribe(params => {
            this.searchTerm = decodeURI(params['s']);

            this.results = this._elasticSearchService.search(this.searchTerm).map((esResult: any) => {
                // Extract results
                // this.searchResults = ((esResult.hits || {}).hits || []);
                this.searchResults = ((esResult.hits || {}).hits || []);

                // console.log(searchResults);
                if (this.searchResults.length > 0) {
                    // console.log('Returning '+this.searchResults.length+' results for term "'+this.searchTerm+'"!');
                    // return searchResults;
                    this.resultsFound = true;
                    return this.searchResults;
                    // return this.searchResults.map((hit) => hit._source);
                } else {
                    if (this.searchTerm && this.searchTerm.trim())
                    this.resultsFound = false;
                    console.log('Nothing was found for search term');
                    return [];
                }
            })
            .catch(this.handleError);

            // console.log('Search for "'+this.searchTerm+'" via search page!');
            // console.log(this.results);
        });
    }

    handleError(): any {
        console.log("Error in search function");
    }
}
