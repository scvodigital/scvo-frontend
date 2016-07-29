import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, Observer, Subject } from 'rxjs';

@Injectable()
export class DrupalService {

    constructor(private http: Http) {}

    loadPage(path): Observable<any> {
        return this.http.get('https://master-o6miopmkpjxjq.eu.platform.sh/'+path+'?_format=json').map((res:Response) => res.json());
    }
}
