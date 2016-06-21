// import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { CORE_DIRECTIVES, Control, FORM_DIRECTIVES } from '@angular/common';
// import { Router, ROUTER_DIRECTIVES } from '@angular/router';
// import { Http } from '@angular/http';
//
// import * as rx from 'rxjs';
// import { Subscription } from 'rxjs/Subscription';
//
// import { Client } from "elasticsearch";
// import { ElasticSearchService } from '../services/elasticsearch.service';

import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Subject';

// export class Search {
//     term: string;
// }

@Injectable()
export class SearchService {
    // getSearchTerm() {
    //     return Promise.resolve();
    // }

    // // Observable string source
    // private searchTermSource = new Subject<string>();
    //
    // // Observable string streams
    // searchTerm$ = this.searchTermSource.asObservable();
    //
    // // Service message commands
    // getTerm(term: string) {
    //     this.searchTermSource.next(term);
    // }
    //
    // visible = true;
    // searchText: Control;
    // searchTextModel: string;
    // selectedValue: string;
    // public results: rx.Observable<any>;
    // hideAutoComplete = true;
    // //changed: EventEmitter<any> = new EventEmitter();
    // subscription: Subscription;
    //
    // @Output() changed = new EventEmitter();
    //
    // @ViewChild("searchInput") input: ElementRef;
    //
    // constructor(private es: ElasticSearchService, private _router:Router, private searchService: SearchService) {
    //     this.searchText = new Control();
    //     // this.searchTextModel = searchService.searchTerm$.subscribe();
    // }
    //
    // getResults(searchText) {
    //     this.results = this.searchText
    //         .valueChanges
    //         .map((value: any) => value ? value.trim() : '')             // ignore spaces
    //         // .do(value => value ? this.message = 'searching...' : this.message = "")
    //         .debounceTime(200)                                          // wait when input completed
    //         .distinctUntilChanged()
    //         .switchMap(value => this.es.search(value))                  // switchable request
    //         .map((esResult: any) => {
    //             // New data
    //             this.changed.emit('');
    //
    //             // Navigate to the search results page
    //             this._router.navigate(['/search']);
    //
    //             // Extract results
    //             var results = ((esResult.hits || {}).hits || []);       // extract results
    //             if (results.length > 0) {
    //                 this.hideAutoComplete = false;
    //                 console.log('Found '+results.length+' results!');
    //                 // Search.refreshResults();
    //                 return results.map((hit) => hit._source);
    //             } else {
    //                 this.hideAutoComplete = true;
    //                 if (this.searchTextModel && this.searchTextModel.trim())
    //                     console.log('Nothing was found :(');
    //                 return [];
    //             }
    //         })
    //         .catch(this.handleError);
    //         // .subscribe(results => this.results = results)
    //
    //     // this.results = this.searchText
    //     //     .valueChanges
    //     //     .map((value: any) => value ? value.trim() : '')             // ignore spaces
    //     //     .do(value => value ? this.message = 'searching...' : this.message = "")
    //     //     .debounceTime(400)                                          // wait when input completed
    //     //     .distinctUntilChanged()
    //     //     .switchMap(value => this.es.search(value))                  // switchable request
    //     //     .map((esResult: any) => {
    //     //         // Navigate to the search results page
    //     //         this._router.navigate(['/search']);
    //     //
    //     //         // Extract results
    //     //         var results = ((esResult.hits || {}).hits || []);       // extract results
    //     //         if (results.length > 0) {
    //     //             this.hideAutoComplete = false;
    //     //             this.message = '';
    //     //             console.log('Found '+results.length+' results!');
    //     //             return results.map((hit) => hit._source);
    //     //         } else {
    //     //             this.hideAutoComplete = true;
    //     //             if (this.searchTextModel && this.searchTextModel.trim())
    //     //                 console.log('Nothing was found :(');
    //     //             return [];
    //     //         }
    //     //     })
    //     //     .catch(this.handleError);
    // }
    //
    // // autocompleteChanged(value) {
    // //     console.log(value);
    // //     this.selectedValue = JSON.stringify(value);
    // // }
    //
    // resultSelected(result) {
    //     this.searchTextModel = result.name;
    //     this.hideAutoComplete = true;
    // }
    //
    // handleError(): any {
    //     console.log("Something went wrong");
    // }
    //
    // ngOnDestroy() {
    //     // prevent memory leak when component destroyed
    //     this.subscription.unsubscribe();
    // }


}
