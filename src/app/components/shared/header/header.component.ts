import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Control } from '@angular/common';

// declare var $: any;

// import * as rx from 'rxjs';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/switchMap';

import { MaterializeDirective } from "angular2-materialize";

import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { InputDebounceComponent } from "../forms/search.input.component";

// import { SearchService } from '../../../services/search.service';
// import { ElasticSearchService } from '../../../services/elasticsearch.service';

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    styleUrls: [require('app/components/shared/header/header.component.scss')],
    directives: [ROUTER_DIRECTIVES, InputDebounceComponent, MaterializeDirective],
    encapsulation: ViewEncapsulation.None
    // providers: [ElasticSearchService],
})
export class HeaderComponent implements AfterViewInit {
    constructor(private router: Router) {}

    ngAfterViewInit() {
        // console.log('MENU!');
        (function($){
            $(function(){

                // console.log($(".side-nav"));
                $('.side-nav').sideNav();

            }); // end of document ready
        })(jQuery); // end of jQuery name space

        // $(".side-nav").sideNav();
    }

    // ngOnInit() {
    //     this.router
    //     .routerState
    //     .queryParams
    //     .subscribe(params => {
    //         this.searchChanged(decodeURI(params['s']));
    //     });
    // }

    public searchChanged(term) {
        this.router.navigate(['/search'], { queryParams: { s: term } });
    }

    // searchTerm: Control;
    // searchTermModel: string;
    // results: rx.Observable<any>;
    // message: string;
    // hideAutocomplete: boolean = true;
    // router: Router;
    //
    // @ViewChild("searchInput") input: ElementRef;
    //
    // constructor (private _searchService: SearchService, private _elasticSearchService: ElasticSearchService) {
    //     this.searchTerm = new Control();
    // }
    //
    // ngOnInit() {
    //     this.results = this.searchTerm.valueChanges
    //         .map((value: any) => value ? value.trim() : '')
    //         .debounceTime(700)
    //         .distinctUntilChanged()
    //         .switchMap(value => this._elasticSearchService.search(value))
    //         .map((esResult: any) => {
    //             // Set term
    //             this._searchService.setTerm(this.searchTermModel);
    //
    //             // Navigate to search page
    //             // this.router.navigate(['/search']);
    //
    //             // Extract results
    //             var searchResults = ((esResult.hits || {}).hits || []);
    //             if (searchResults.length > 0) {
    //                 this.hideAutocomplete = false;
    //                 console.log('Returning '+searchResults.length+' results for term "'+this.searchTermModel+'"!');
    //                 return searchResults.map((hit) => hit._source);
    //             } else {
    //                 this.hideAutocomplete = true;
    //                 if (this.searchTermModel && this.searchTermModel.trim())
    //                     console.log('Nothing was found for search term');
    //                 return [{}];
    //             }
    //         })
    //         .catch(this.handleError);
    // }
    //
    // selectResult(term) {
    //     this.searchTermModel = term;
    //     this.hideAutocomplete = true;
    // }
    //
    // handleError(): any {
    //     console.log("Error in search function");
    // }
}
