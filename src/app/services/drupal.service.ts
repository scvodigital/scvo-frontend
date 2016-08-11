import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, Observer, Subject } from 'rxjs';

@Injectable()
export class DrupalService {
    private settings: Object = {};

    constructor(private http: Http) {}

    request(path): Observable<any> {
        return this.http.get(path+'?_format=json').map((res:Response) => res.json());
    }
}
