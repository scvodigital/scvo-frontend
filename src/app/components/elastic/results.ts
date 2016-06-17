import { Component } from '@angular/core';
import { Elasticsearch } from '../../services/elasticsearch';
import { Observable } from 'rxjs/Observable';
import { RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'results',
    templateUrl: 'app/components/elastic/results.html',
    styleUrls: ['app/components/elastic/results.css'],
    providers: [],
    directives: [ ROUTER_DIRECTIVES ],
    pipes: []
})
export class Results {
    results: Observable<any>;
    constructor(public elasticsearch: Elasticsearch, public params: RouteSegment) {}

    ngOnInit() {
        this.results = this.elasticsearch.getTerm(this.params.getParam('term'));
    }
}
