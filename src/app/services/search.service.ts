// import { Injectable, ViewChild, ElementRef } from '@angular/core';
// import { Control } from '@angular/common';
// import { URLSearchParams, Jsonp } from '@angular/http';
//
// import * as rx from 'rxjs';
//
// import { ElasticSearchService } from './elasticsearch.service';
//
// @Injectable()
// export class SearchService {
//
//     searchTerm: Control;
//     searchTermModel: string;
//     results: rx.Observable<any>;
//     message: string;
//     hideAutocomplete: boolean = true;
//
//     @ViewChild("searchInput") input: ElementRef;
//
//     constructor (private _searchService: SearchService, private _elasticSearchService: ElasticSearchService) {
//         this.searchTerm = new Control();
//     }
//
//     ngOnInit() {
//         this.results = this.searchTerm.valueChanges
//             .map((value: any) => value ? value.trim() : '')
//             .debounceTime(700)
//             .distinctUntilChanged()
//             .switchMap(value => this._elasticSearchService.search(value))
//             .map((esResult: any) => {
//                 // Extract results
//                 var searchResults = ((esResult.hits || {}).hits || []);
//                 if (searchResults.length > 0) {
//                     this.hideAutocomplete = false;
//                     console.log('Returning '+searchResults.length+' results for term "'+this.searchTermModel+'"!');
//                     return searchResults.map((hit) => hit._source);
//                 } else {
//                     this.hideAutocomplete = true;
//                     if (this.searchTermModel && this.searchTermModel.trim())
//                         console.log('Nothing was found for search term');
//                     return [{}];
//                 }
//             })
//             .catch(this.handleError);
//     }
//
//     search(term) {
//     //    return this._elasticSearchService.search(term);
//     }
//
//     selectResult(term) {
//         this.searchTermModel = term;
//         this.hideAutocomplete = true;
//     }
//
//     handleError(): any {
//         console.log("Error in search function");
//     }
//
//      // constructor(private jsonp: Jsonp) {}
//   //
//   // search(terms: Observable<string>, debounceDuration = 400) {
//   //   return terms.debounceTime(debounceDuration)
//   //               .distinctUntilChanged()
//   //               .switchMap(term => this.rawSearch(term));
//   // }
//   //
//   // rawSearch (term: string) {
//   //   var search = new URLSearchParams()
//   //   search.set('action', 'opensearch');
//   //   search.set('search', term);
//   //   search.set('format', 'json');
//   //   return this.jsonp
//   //               .get('https://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search })
//   //               .map((request) => request.json()[1]);
//   // }
// }
