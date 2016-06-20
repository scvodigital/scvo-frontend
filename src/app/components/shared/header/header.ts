import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CORE_DIRECTIVES, Control, FORM_DIRECTIVES } from '@angular/common';
import * as rx from 'rxjs';
import { ElasticSearchService } from '../elasticsearch.service';
import { Http } from '@angular/http';
import { Client } from "elasticsearch";
import { Routes, Router, ROUTER_DIRECTIVES } from '@angular/router';

import { Search } from '../../elastic/search';

@Component({
    selector: 'header',
    templateUrl: 'app/components/shared/header/header.html',
    styleUrls: ['app/components/shared/header/header.css'],
    providers: [],
    directives: [ROUTER_DIRECTIVES],
    pipes: [],
    outputs: ['results'],
})
export class Header {
    visible = true;
    searchText: Control;
    searchTextModel: string;
    results: rx.Observable<any>;
    message: string;
    active: boolean = false;
    changed: EventEmitter<any> = new EventEmitter();
    @ViewChild("searchInput") input: ElementRef;

    constructor(private es: ElasticSearchService) {
        this.searchText = new Control();
    }

    ngOnInit() {
        this.results = this.searchText
            .valueChanges
            .map((value: any) => value ? value.trim() : '')             // ignore spaces
            .do(value => value ? this.message = 'searching...' : this.message = "")
            .debounceTime(700)                                          // wait when input completed
            .distinctUntilChanged()
            .switchMap(value => this.es.search(value))                  // switchable request
            .map((esResult: any) => {
                var results = ((esResult.hits || {}).hits || []);       // extract results
                if (results.length > 0) {
                    this.message = '';
                    return results.map((hit) => hit._source);
                } else {
                    if (this.searchTextModel && this.searchTextModel.trim())
                        this.message = 'nothing was found';
                    return [];
                }
            })
            .catch(this.handleError);
    }

    resultSelected(result) {
        this.changed.next(result);
    }

    handleError(): any {
        this.message = "something went wrong";
    }
}
