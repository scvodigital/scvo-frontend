import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import * as elasticsearch from "elasticsearch";

@Injectable()
export class ElasticSearchService {
    search(value): Observable<any> {
        if (value) {
            console.log(value)
            var client = new elasticsearch.Client({
                host: 'http://localhost:9200',
                log: 'trace'
            });
            return Observable.fromPromise(client.search({
                index: 'blog',
                q: `title:${value}`
            }))
        }else{
            return Observable.of({})
        }

    }
    addToIndex(value): Observable<any> {
        var client = new elasticsearch.Client({
            host: 'http://localhost:9200',
            log: 'trace'
        });
        return Observable.fromPromise(client.create(value))
    }
    isAvailable(): Promise<any> {
        var client = new elasticsearch.Client({
            host: 'http://localhost:9200',
            log: 'trace'
        });
        return client.ping({
            requestTimeout: Infinity,
            hello: "elasticsearch!"
        });
    }
}
