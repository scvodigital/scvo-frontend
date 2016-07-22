import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

import * as elasticsearch from "elasticsearch";

@Injectable()
export class ElasticService {

    search(term): Observable<any> {
        if (term) {
            console.log(term)
            var client = new elasticsearch.Client({
                host: 'https://readonly:onlyread@4c19757a0460c764d6e4712b0190cc21.eu-west-1.aws.found.io:9243',
                // log: 'trace'
            });
            return Observable.fromPromise(client.search({
                index: '_all', // The magic (all indices)
                q: `${term}`
            }))
        } else {
            return Observable.of({})
        }
    }
}
