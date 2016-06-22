// import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { CORE_DIRECTIVES, Control, FORM_DIRECTIVES } from '@angular/common';
// import * as rx from 'rxjs';

import { Component, OnInit, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Control } from '@angular/common';

import * as rx from 'rxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ROUTER_DIRECTIVES, Router } from '@angular/router';

// import { SearchService } from '../../../services/search.service';
import { ElasticSearchService } from '../../../services/elasticsearch.service';

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    styleUrls: [require('app/components/shared/header/header.component.scss')],
    directives: [ROUTER_DIRECTIVES],
    providers: [ElasticSearchService],
    // changeDetection: ChangeDetectionStrategy.CheckAlways
})
export class HeaderComponent { //implements OnInit
    // visible = true;
    searchTerm: Control;
    searchTermModel: string;
    // results: Observable<any>;
    results: rx.Observable<any>;
    // results: rx.Observable<{}>;
    message: string;
    hideAutocomplete: boolean = true;
    router: Router;

    // changeDetectorRefs: ChangeDetectorRef[] = [];

    // changed: EventEmitter<any> = new EventEmitter();
    // @ViewChild("seachInput") input: ElementRef;
    @ViewChild("searchInput") input: ElementRef;

    // items: Observable<Array<string>>;
    // term = new Control();

    constructor (private _searchService: ElasticSearchService) {//private _changeDetector: ChangeDetectorRef
        this.searchTerm = new Control();
        //this.router = new Router();
        //this.results = new rx.Observable<Array<any>>();
    }

    ngOnInit() {
        // this.seachText = new Control();
        // this.results = new rx.Observable<Array<Object>>();
        this.results = this.searchTerm.valueChanges
            // .map((value: any) => value ? value.trim() : '')             // ignore spaces
            // .do(value => value ? this.message = 'searching...' : this.message = "")
            .debounceTime(700)                                          // wait when input completed
            .distinctUntilChanged()
            .switchMap(value => this._searchService.search(value))                  // switchable request
            .map((esResult: any) => {
                // this.router.navigate(['/search']);
                var searchResults = ((esResult.hits || {}).hits || []);       // extract results
                if (searchResults.length > 0) {
                    this.hideAutocomplete = false;
                    console.log('Returning '+searchResults.length+' results for term "'+this.searchTermModel+'"!');
                    //console.log(searchResults.map((hit) => hit._source));
                    // this._changeDetector.markForCheck();
                    return searchResults.map((hit) => hit._source);
                } else {
                    this.hideAutocomplete = true;
                    if (this.searchTermModel && this.searchTermModel.trim())
                        console.log('Nothing was found for search term');
                    return [{}];
                }
            })
            .catch(this.handleError);
    }

    selectResult(term) {
        this.searchTermModel = term;
        this.hideAutocomplete = true;
    }

    // resultSelected(result) {
    //     this.changed.next(result);
    // }

    // ngOnInit() {
    //     this.results = this.seachText
    //     .valueChanges
    //     .map((value: any) => value ? value.trim() : '')             // ignore spaces
    //     .do(value => value ? this.message = 'searching...' : this.message = "")
    //     .debounceTime(400)                                          // wait when input completed
    //     .distinctUntilChanged()
    //     .switchMap(value => this.es.search(value))                  // switchable request
    //     .map((esResult: any) => {
    //         var results = ((esResult.hits || {}).hits || []);       // extract results
    //         if (results.length > 0) {
    //             this.message = '';
    //             return results.map((hit) => hit._source);
    //         } else {
    //             if (this.seachTextModel && this.seachTextModel.trim())
    //             this.message = 'nothing was found';
    //             return [];
    //         }
    //     })
    //     .catch(this.handleError);
    // }
    //
    // resutSelected(result) {
    //     this.changed.next(result);
    // }
    handleError(): any {
        console.log("Error in search function");
    }
}
