import { Component } from '@angular/core';

import { Header } from '../../components/shared/header/header';

@Component({
    selector: 'search',
    templateUrl: 'app/components/elastic/search.html',
    styleUrls: ['app/components/elastic/search.css'],
    providers: [],
    directives: [Header],
    pipes: [],
})
export class Search {
    constructor() {}

    ngOnInit() {}

}
