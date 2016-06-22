import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as elasticsearch from "elasticsearch";

@Injectable()
export class ElasticSearchService {
    elastichost = 'https://readonly:onlyread@4c19757a0460c764d6e4712b0190cc21.eu-west-1.aws.found.io:9243';

    search(term: string): Observable<any> {
        if (term) {
            // console.log(value)
            var client = new elasticsearch.Client({
                host: this.elastichost,
                log: 'trace'
            });
            // console.log('FOUND THINGS!');
            // Build query here...
            return Observable.fromPromise(client.search({
                index: '*', // The magic (all indices)
                q: `${term}`
            }))
        } else {
            return Observable.of({})
        }

    }
    // addToIndex(value): Observable<any> {
    //     var client = new elasticsearch.Client({
    //         host: this.elastichost,
    //         log: 'trace'
    //     });
    //     return Observable.fromPromise(client.create(value))
    // }
    isAvailable(): Promise<any> {
        var client = new elasticsearch.Client({
            host: this.elastichost,
            log: 'trace'
        });
        return client.ping({
            requestTimeout: Infinity,
            hello: "elasticsearch!"
        });
    }
}
