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
    public index: string = 'goodmoves-test';

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
                    "size": 0,
                    "aggs": {
                        "regions": {
                            "terms": {
                                "field": "region",
                                "size": 0
                            }
                        },
                        "sectors": {
                            "terms": {
                                "field": "sectors",
                                "order": { "_term": "asc" },
                                "size": 0
                            }
                        },
                        "roles": {
                            "terms": {
                                "field": "roles",
                                "order": { "_term": "asc" },
                                "size": 0
                            }
                        },
                        "statuses": {
                            "terms": {
                                "field": "status",
                                "size": 0
                            }
                        }
                    }
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
                    type: 'job',
                    size: 10,
                    body: this.applySiteFilter(body)
                };

                for (var p in overrides) {
                    if (overrides.hasOwnProperty(p)) {
                        payload[p] = overrides[p];
                    }
                }

                if (!allowAll) {
                    var openOnly = {
                        query: { bool: { must: [{ term: { vacancy_status: 'vacancy-open' } }] } }
                    }
                    payload.body = deepmerge(payload.body, openOnly, {
                        arrayMerge: (destination, source, options) => {
                            return destination.concat(source);
                        }
                    });
                }

                client.search(payload).then(response => {
                    resolve(response);
                }).catch(err => {
                    console.error('Error searching', payload, err);
                    reject(err);
                });
            });
        });
    }

    private applySiteFilter(body: any) {
        body = deepmerge(body, this.searchRestriction, {
            arrayMerge: (destination, source, options) => {
                return destination.concat(source);
            }
        });
        return body;
    }

    public getCountryCount(): Promise<{ [countryCode: string]: number }> {
        return new Promise((resolve, reject) => {
            var body = {
                aggs: {
                    items: {
                        terms: {
                            'field': 'country_iso3',
                            'size': 0
                        }
                    }
                }
            };

            var lookup = {
                'GBR': 'United Kingdom'
            }

            this.getClient().then((client: any) => {
                var payload = {
                    index: 'goodmoves',
                    type: 'vacancy',
                    size: 0,
                    body: body
                };

                client.search(payload).then(response => {
                    var counts = [];
                    response.aggregations.items.buckets.forEach((item) => {
                        counts.push([lookup[item.key], item.doc_count]);
                    });
                    resolve(counts);
                }).catch(err => {
                    console.error('Error searching', payload, err);
                    reject(err);
                });
            }).catch(reject);
        });
    }

    public doSearch(parameters: ISearchParameters): Promise<IHits<any>> {
        return new Promise((resolve, reject) => {
            var body: any = {
                query: {
                    bool: {
                        must: []
                    }
                }
            };

            if (parameters.query) { body.query.bool.must.push({ "simple_query_string": { "query": parameters.query } }) }
            if (parameters.roles) { body.query.bool.must.push({ "term": { "roles_slugs": parameters.roles } }); }
            if (parameters.sectors) { body.query.bool.must.push({ "term": { "sectors_slugs": parameters.sectors } }); }
            if (parameters.regions) { body.query.bool.must.push({ "term": { "region_slug": parameters.regions } }); }
            if (parameters.statuses) { body.query.bool.must.push({ "term": { "status_slug": parameters.statuses } }); }
            if (parameters.minimumSalary) { body.query.bool.must.push({ "range": { "salary_min": { "gte": parameters.minimumSalary } } }); }
            if (parameters.top) { body.query.bool.must.push({ "term": { top_job: true } }) }

            var overrides: any = {
                from: (parameters.page - 1) * 10
            }

            if (parameters.sort) {
                body.sort = [parameters.sort];
            }

            this.search(body, overrides).then(response => {
                resolve(response.hits);
            }).catch(reject);
        });
    }

    public getTheseJobs(ids: string[]): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if (Array.isArray(ids)) {
                ids = ids.filter(id => { return id ? true : false });
            }

            if (!Array.isArray(ids) || ids.length === 0) {
                resolve([]);
            }

            var body = {
                filter: {
                    terms: {
                        Id: ids
                    }
                }
            }

            this.search(body, { size: 100 }, true).then(results => {
                resolve(results.hits.hits.map(hit => hit._source));
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

export interface ISearchParameters {
    sectors: string,
    roles: string,
    regions: string,
    statuses: string,
    query: string,
    minimumSalary: string
    page: number;
    sortKey: string;
    sort: { [key: string]: string };
    top: boolean;
}
