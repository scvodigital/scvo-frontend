import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import * as elasticsearch from 'elasticsearch';
import * as _ from 'lodash';
import * as deepmerge from 'deepmerge';

@Injectable()
export class ElasticService {
    public searchRestriction: any;
    public searchFilters: any = [];
    public index: string = '*';
    public type: string = '*';
    public size: number = 10;

    constructor() { }

    static searchCompleted: Subject<ISearchParameters> = Subject.create();

    public getClient() {
        return new Promise((resolve, reject) => {
            try {
                var connectionString = 'https://readonly:onlyread@4c19757a0460c764d6e4712b0190cc21.eu-west-1.aws.found.io/';
                // console.log(connectionString);

                var client = new elasticsearch.Client({
                    host: connectionString
                });

                resolve(client);
            } catch (err) {
                reject(err);
            }
        });
    }

    public getTermCounts() {
        return new Promise((resolve, reject) => {
            this.getClient().then((client: any) => {
                var payload = {
                    "aggs": {
                        "categories": {
                            "terms": {
                                "field": "category-na",
                                "order" : { "_term" : "asc" },
                                "size": 0
                            }
                        }
                    },
                    "size": 0
                };

                this.search(payload, { size: 0 }).then(response => {
                    resolve(response);
                });
            });
        });
    }

    search(body: any, overrides: any = {}, allowAll: boolean = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getClient().then((client: any) => {
                var payload = {
                    index: this.index,
                    type: this.type,
                    size: this.size,
                    body: body
                };

                for (var p in overrides) {
                    if (overrides.hasOwnProperty(p)) {
                        payload[p] = overrides[p];
                    }
                }

                console.log('Search request:');
                console.log(payload);

                // if (!allowAll) {
                //     var openOnly = {
                //         query: { bool: { must: [{ term: { vacancy_status: 'vacancy-open' } }] } }
                //     }
                //     payload.body = deepmerge(payload.body, openOnly, {
                //         arrayMerge: (destination, source, options) => {
                //             return destination.concat(source);
                //         }
                //     });
                // }

                client.search(payload, overrides).then(response => {
                    resolve(response);
                }).catch(err => {
                    console.error('Error searching', payload, err);
                    reject(err);
                });
            });
        });
    }

    getResultCount(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.getClient().then((client: any) => {
                client.count({ index: this.index }).then((response) => {
                    resolve(response.count);
                }).catch((err) => {
                    console.error('Failed to get document count', err);
                    resolve(null);
                })
            });
        });
    }

    public constructSearch(parameters: ISearchParameters): Promise<IHits<any>> {
        return new Promise((resolve, reject) => {
            var body: any = {
                query: {
                    bool: {
                        must: []
                    }
                }
            };

            this.index = parameters.index;
            this.type = parameters.type;
            this.size = parameters.size;

            if (parameters.query) {
                body.query.bool.must.push({ "simple_query_string": { "query": parameters.query } })
            }
            // if (parameters.category) {
            //     body.query.bool.must.push({ "term": { "library_classification_slugs": parameters.category } });
            // }
            // if (parameters.roles) { body.query.bool.must.push({ "term": { "roles_slugs": parameters.roles } }); }
            // if (parameters.sectors) { body.query.bool.must.push({ "term": { "sectors_slugs": parameters.sectors } }); }
            // if (parameters.regions) { body.query.bool.must.push({ "term": { "region_slug": parameters.regions } }); }
            // if (parameters.statuses) { body.query.bool.must.push({ "term": { "status_slug": parameters.statuses } }); }
            // if (parameters.minimumSalary) { body.query.bool.must.push({ "range": { "salary_min": { "gte": parameters.minimumSalary } } }); }
            // if (parameters.top) { body.query.bool.must.push({ "term": { top_job: true } }) }

            switch(parameters.sort) {
                case('a-z'):
                    body.sort = { 'title': { order: 'asc' } };
                    break;
                case('z-a'):
                    body.sort = { 'title': { order: 'desc' } };
                    break;
                case('start'):
                    body.sort = { 'dateStart': { order: 'asc' } };
                    break;
                case('date'):
                    body.sort = { 'date_posted': { order: 'desc' } };
                    break;
                default:
                    body.sort = {};
                    break;
            }

            var overrides: any = {
                from: (parameters.page - 1) * 10
            }

            // if (parameters.sort) {
            //     body.sort = [parameters.sort];
            // }

            this.search(body, overrides).then(response => {
                resolve(response.hits);
            }).catch(reject);
        });
    }

    public getResult(index: string, type: string, slug: string): Promise<IHits<IDocument>> {
        return new Promise((resolve, reject) => {
            var body: any = {
                filter: {
                    term: { "slug": slug }
                }
            };

            this.index = index;
            this.type = type;

            var overrides: any = {
                size: 1
            }

            this.search(body, overrides).then(results => {
                if (results.hits.total < 1) {
                    return reject(new Error('Document not found'));
                }
                resolve(results.hits);
            }).catch(reject);
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

export interface IAsset {
    id: number;
    title: string;
    filename: string;
    content_type: string;
}

export interface IDocument {
    id: string;
    title: string;
    slug: string;
    abstract: string;
}

export interface ISearchParameters {
    index?: string,
    type?: string,
    size?: number,
    query?: string,
    category?: string,
    page?: number;
    sort?: string;
}
