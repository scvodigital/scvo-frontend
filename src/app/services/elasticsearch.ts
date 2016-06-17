import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Elasticsearch {
    constructor(private http: Http) {}

    getTerm(term: string) {
        return this.makeRequest(`scvo/${term}`);
    }

    private makeRequest(path: string) {
        let params = new URLSearchParams();
        //params.set('', '');

        let url = `https://readonly:onlyread@4c19757a0460c764d6e4712b0190cc21.eu-west-1.aws.found.io:9243/${ path }`;
        return this.http.get(url, {search: params})
        .map((res) => res.json());
    }
}
