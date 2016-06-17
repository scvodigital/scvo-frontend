import { Component } from '@angular/core';
import { Router, Routes, ROUTER_DIRECTIVES } from '@angular/router';

import { Results } from '../elastic/results';
import { Elasticsearch } from '../../services/elasticsearch';

@Component({
    selector: 'search',
    templateUrl: 'app/components/elastic/search.html',
    styleUrls: ['app/components/elastic/search.css'],
    providers: [ Elasticsearch ],
    directives: [ ROUTER_DIRECTIVES ],
    pipes: []
})
@Routes([
    { path: '/:term',        component: Results },
    { path: '/:term/:name',  component: Results },
])
export class Search {

    constructor(private router: Router, private elasticsearch: Elasticsearch) {}

    searchForTerm(term: string) {
        this.elasticsearch.getTerm(term)
        .subscribe(({name}) => {
            console.log('Search term: '+name);
            this.router.navigate(['/search', term]);
        });
    }

}
