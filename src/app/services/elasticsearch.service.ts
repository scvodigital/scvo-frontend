import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

declare var elasticsearch: any;

@Injectable()
export class ElasticSearchService {
    static searchCompleted: Subject<ISearchParameters> = Subject.create();

    public search(field: string): Promise<ITerm[]> {
        return new Promise((resolve, reject) => {
            this.getClient().then((client: any) => {
                client.search({
                    index: 'goodmoves',
                    type: 'vacancy',
                    size: 0,
                    body: {
                        aggs: {
                            items: {
                                terms: {
                                    'field': field,
                                    'size': 0,
                                    'order' : { '_term' : 'asc' }
                                }
                            }
                        },
                    }
                }).then((response: any) => {
                    console.log('Aggregations Response', response);
                    var terms: ITerm[] = [];
                    response.aggregations.items.buckets.forEach((item) => {
                        terms.push({
                            term: item.key,
                            count: item.doc_count
                        });
                    });
                    resolve(terms);
                }, reject);
            }).catch(reject);
        });
    }

    public doSearch<T>(parameters: ISearchParameters): Promise<IHits<T>> {
        var body: any = {
            query: {
                bool: {
                    must: []
                }
            }
        };

        if (parameters.roles) { body.query.bool.must.push({ term: { roles: parameters.roles } }); }
        if (parameters.sectors) { body.query.bool.must.push({ term: { sectors: parameters.sectors } }); }
        if (parameters.region) { body.query.bool.must.push({ term: { region: parameters.region } }); }
        if (parameters.status) { body.query.bool.must.push({ term: { status: parameters.status } }); }
        if (parameters.organisation) { body.query.bool.must.push({ term: { organisation_id: parameters.organisation } }); }
        if (parameters.query) { body.query.bool.must.push({ simple_query_string: { query: parameters.query } })}

        ElasticSearchService.searchCompleted.next(parameters);

        return new Promise((resolve, reject) => {
            this.getClient().then((client: any) => {
                client.search({
                    index: 'goodmoves',
                    type: 'vacancy',
                    size: 10,
                    body: body
                }).then((response: any) => {
                    resolve(response.hits);
                }, reject);
            }).catch(reject);
        });
    }

    public getVacancy(id: number): Promise<IVacancy> {
        return new Promise<IVacancy>((resolve, reject) => {
            this.getClient().then((client: any) => {
                client.get({
                    index: 'goodmoves',
                    type: 'vacancy',
                    id: id
                }, (err, response) => {
                    if (err) return reject(err);
                    if (response.found) {
                        resolve(response._source);
                    } else {
                        reject(new Error('Vacancy ' + id + 'not found'));
                    }
                });
            });
        });
    }

    public getClient() {
        return new Promise((resolve, reject) => {
            try {
                var connectionString = 'https://readonly:onlyread@4c19757a0460c764d6e4712b0190cc21.eu-west-1.aws.found.io:9243/';
                console.log(connectionString);

                var client = new elasticsearch.Client({
                    host: connectionString
                });

                resolve(client);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export interface ITerm {
    term: string;
    count: number;
}

export interface IHits<T> {
    total: number;
    max_score: number;
    hits: IHit<T>[];
}

export interface IHit<T> {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: T[];
}

export interface IVacancy {
    id: number,
    title: string,
    description: string;
    application_notes: string;
    additional: string;
    reference_number: number;
    location: string;
    salary_min: number;
    salary_max: number;
    salary_info: string;
    benefits: string;
    closing_date: Date;
    active: boolean;
    language: string;
    language_code: string;
    organisation: string;
    organisation_website: string;
    charity_number: string;
    asset_id: number;
    status: string;
    region: string;
    country: string;
    country_iso3: string;
    country_culture: string;
    roles: string[];
    sectors: string[];
    assets: IAsset[];
}

export interface IAsset {
    id: number,
    title: string,
    filename: string,
    content_type: string
}

export interface ISearchParameters {
    sectors: string,
    roles: string,
    region: string,
    status: string,
    organisation: string,
    query: string,
    minimumSalary: string
}

export class SearchParameters implements ISearchParameters {
    sectors: string;
    roles: string;
    region: string;
    status: string;
    organisation: string;
    query: string;
    minimumSalary: string;
}


// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import * as elasticsearch from "elasticsearch";
//
// @Injectable()
// export class ElasticSearchService {
//     elastichost = 'https://readonly:onlyread@4c19757a0460c764d6e4712b0190cc21.eu-west-1.aws.found.io:9243';
//
//     search(term: string): Observable<any> {
//         if (term) {
//             // console.log(value)
//             var client = new elasticsearch.Client({
//                 host: this.elastichost,
//                 // log: 'trace'
//             });
//             // Build query here...
//             return Observable.fromPromise(client.search({
//                 index: '_all', // The magic (all indices)
//                 q: `${term}`
//             }))
//         } else {
//             return Observable.of({})
//         }
//     }
//     // addToIndex(value): Observable<any> {
//     //     var client = new elasticsearch.Client({
//     //         host: this.elastichost,
//     //         log: 'trace'
//     //     });
//     //     return Observable.fromPromise(client.create(value))
//     // }
//     isAvailable(): Promise<any> {
//         var client = new elasticsearch.Client({
//             host: this.elastichost,
//             log: 'trace'
//         });
//         return client.ping({
//             requestTimeout: Infinity,
//             hello: "elasticsearch!"
//         });
//     }
// }
