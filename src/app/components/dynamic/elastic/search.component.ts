import { Component, NgZone, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CORE_DIRECTIVES, Control, FORM_DIRECTIVES } from '@angular/common';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import * as rx from 'rxjs';

import { ElasticService } from '../../../services/elastic.service';

// import { Component, NgZone, Output, EventEmitter } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Control } from '@angular/common';
// import { URLSearchParams, Jsonp } from '@angular/http';
//
// import * as rx from 'rxjs';

@Component({
    selector: 'search',
    templateUrl: 'app/components/dynamic/elastic/search.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
    events: ['newResults']
})
export class SearchComponent implements OnInit {
    // visible = true;
    searchText: Control;
    searchTextModel: string;
    results: rx.Observable<any>;
    // results: Array<any>;
    // message: string;
    // active: boolean = false;
    newResults: EventEmitter<any> = new EventEmitter();
    // @ViewChild("searchInput") input: ElementRef;

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
                        // console.log(results);
                        if (results.length > 0) {
                            // console.log(results.map((hit) => hit));
                            return results;
                            // return results.map((hit) => hit);
                        } else {
                            if (this.searchTextModel && this.searchTextModel.trim())
                                console.log('Nothing was found for search term: '+this.searchTextModel);
                            return [];
                        }
                });
            });

            console.log(this.results);
        });

        // this.results = todosService.todos$;
    }

    // this.results = this.searchText
    //     .valueChanges
    //     .map((value: any) => value ? value.trim() : '')             // ignore spaces
    //     .do(value => value ? this.message = 'Searching for: '+value : this.message = "")
    //     .debounceTime(700)                                          // wait when input completed
    //     .distinctUntilChanged()
    //     .switchMap(value => this.es.search(value))                  // switchable request
    //     .map((esResult: any) => {
    //         var results = ((esResult.hits || {}).hits || []);       // extract results
    //         console.log(results);
    //         if (results.length > 0) {
    //             this.message = '';
    //             return results.map((hit) => hit._source);
    //         } else {
    //             if (this.searchTextModel && this.searchTextModel.trim())
    //                 this.message = 'nothing was found';
    //             return [];
    //         }
    //     })
    //     .catch(this.handleError);
    // console.log(this.message);

    handleError(): any {
        console.log("Error in search function");
    }
    //
    // resutSelected(result) {
    //     this.changed.next(result);
    // }
}

// // import { SearchService } from '../../services/search.service';
// import { ElasticService, IHits, IVacancy, IHit, ISearchParameters } from '../../services/elastic.service';
//
// @Component({
//     selector: 'search',
//     templateUrl: 'app/components/elastic/search.component.html',
//     styleUrls: [require('app/components/elastic/search.component.scss')],
//     providers: [ElasticService],
// })
// export class SearchComponent {
//     hits: IHit<IVacancy>[];
// 	@Output() searchChange = new EventEmitter();
// 	get parameters(): ISearchParameters{
// 		return {
// 			query: this.activatedRoute.params['query'],
// 			roles: this.activatedRoute.params['roles'],
// 			sectors: this.activatedRoute.params['sectors'],
// 			region: this.activatedRoute.params['region'],
// 			status: this.activatedRoute.params['status'],
// 			minimumSalary: this.activatedRoute.params['minimumSalary'],
// 			organisation: this.activatedRoute.params['organisation']
// 		}
// 	};
//
// 	constructor(private elasticService: ElasticService, private activatedRoute: ActivatedRoute) {	}
//
// 	ngOnInit() {
// 		this.elasticService.doSearch<IVacancy>(this.parameters).then(
// 			(results) => this.hits = results.hits
// 		)
// 	}
//
//     // searchTerm: string;
//     //
//     // results: rx.Observable<any>;
//     // searchResults: Array<any>;
//     // countResults: number;
//     // resultsFound: boolean = false;
//     //
//     // constructor(private router: Router, private _elasticService: ElasticService) {}
//     //
//     // ngOnInit() {
//     //     // Get query parameters
//     //     this.router
//     //     .routerState
//     //     .queryParams
//     //     .subscribe(params => {
//     //         this.searchTerm = decodeURI(params['s']);
//     //
//     //         // this.results = this._elasticService.search(this.searchTerm).map((esResult: any) => {
//     //         //     // Extract results
//     //         //     // this.searchResults = ((esResult.hits || {}).hits || []);
//     //         //     this.searchResults = ((esResult.hits || {}).hits || []);
//     //         //
//     //         //     // console.log(searchResults);
//     //         //     if (this.searchResults.length > 0) {
//     //         //         // console.log('Returning '+this.searchResults.length+' results for term "'+this.searchTerm+'"!');
//     //         //         // return searchResults;
//     //         //         this.resultsFound = true;
//     //         //         return this.searchResults;
//     //         //         // return this.searchResults.map((hit) => hit._source);
//     //         //     } else {
//     //         //         if (this.searchTerm && this.searchTerm.trim())
//     //         //         this.resultsFound = false;
//     //         //         console.log('Nothing was found for search term');
//     //         //         return [];
//     //         //     }
//     //         // })
//     //         // .catch(this.handleError);
//     //
//     //         // console.log('Search for "'+this.searchTerm+'" via search page!');
//     //         // console.log(this.results);
//     //     });
//     // }
//     //
//     // handleError(): any {
//     //     console.log("Error in search function");
//     // }
// }
