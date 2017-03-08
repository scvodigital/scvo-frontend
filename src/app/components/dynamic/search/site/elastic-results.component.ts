import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { ElasticService } from '../../../../services/elastic.service';

@Component({
    selector: 'search',
    templateUrl: './elastic-results.component.html'
})
export class SiteSearchComponent implements OnInit {
    searchText: FormControl;
    searchTextModel: string;

    // @Output() searchEvent: EventEmitter<any> = new EventEmitter();

    public results: Observable<any>;

    constructor(private router: Router, private route: ActivatedRoute, private es: ElasticService) {
        // this.searchText = new FormControl();
        // this.results = new Observable<Array<any>>();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.searchTextModel = decodeURI(params['s']);
            if (this.searchTextModel !== '') {
                // console.log('Searching for: '+this.searchTextModel);

                this.results = this.es.search(this.searchTextModel)
                    .map((esResult: any) => {
                        var results = ((esResult.hits || {}).hits || []);
                        if (results.length > 0) {
                            // this._results.next(results);
                            return results;
                        } else {
                            if (this.searchTextModel && this.searchTextModel.trim())
                                console.log('Nothing was found for search term: '+this.searchTextModel);
                            return [];
                        }
                    });

                // console.log(this.results);
            }
        });
    }

    handleError(): any {
        console.log("Error in search function");
    }
}
