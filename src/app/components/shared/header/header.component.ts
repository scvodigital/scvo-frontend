import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Control } from '@angular/common';

import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

import { InputDebounceComponent } from "../forms/search.input.component";

declare var $: any;

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.component.html',
    styleUrls: [require('app/components/shared/header/header.component.scss')],
    directives: [ROUTER_DIRECTIVES, InputDebounceComponent, MaterializeDirective],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

    constructor(private router: Router) {
        //HACK: Can't find the correct Lifecycle hook so just sticking this in a timer because trial and error this way ain't good
        //can work it out after go live when less under pressure
        setTimeout(() => {
            // console.log('Initiating Side Nav');
            $('.button-collapse').sideNav({
                closeOnClick: true,
                menuWidth: 350
            });
        }, 1000);
    }

    AfterViewInit (){
    }

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
