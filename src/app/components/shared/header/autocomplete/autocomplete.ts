import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CORE_DIRECTIVES, Control, FORM_DIRECTIVES } from '@angular/common';
import * as rx from 'rxjs';
import { ElasticSearchService } from '../../elasticsearch.service';

@Component({
    selector: 'autocomplete',
    template: require('./autocomplete.html'),
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
    outputs: ['changed'],
    styleUrls: [require('./style.css')]
})

export class AutoComplete implements OnInit {
    visible = true;
    seachText: Control;
    seachTextModel: string;
    results: rx.Observable<any>;
    message: string;
    active: boolean = false;
    changed: EventEmitter<any> = new EventEmitter();
    @ViewChild("seachInput") input: ElementRef;

    constructor(private es: ElasticSearchService) {
        this.seachText = new Control();
        this.results = new rx.Observable<Array<any>>();
    }

    ngOnInit() {
        this.results = this.seachText
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
                    if (this.seachTextModel && this.seachTextModel.trim())
                        this.message = 'nothing was found';
                    return [];
                }
            })
            .catch(this.handleError);
    }

    resutSelected(result) {
        this.changed.next(result);
    }
    handleError(): any {
        this.message = "something went wrong";
    }
}
