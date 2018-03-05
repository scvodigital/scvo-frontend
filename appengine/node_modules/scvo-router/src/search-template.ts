// Node imports
import * as util from 'util';

// Module imports
import * as handlebars from 'handlebars';
const hbs = require('nymag-handlebars')(handlebars);
import { SearchParams } from 'elasticsearch';

// Internal imports
import { ISearchTemplate, ISearchTemplateSet, ISearchHead, ISearchQuery, IJsonable } from './interfaces';
import { Helpers } from './helpers';

/** Class to construct an Elasticsearch query */
export class SearchTemplate implements ISearchTemplate, IJsonable {
    index: string = null;
    type: string = null;
    template: string = null;

    // Instance specific properties
    private compiledTemplate: (obj: any, hbs?: any) => string = null;

    public toJSON(): ISearchTemplate {
        return {
            index: this.index,
            type: this.type,
            template: this.template
        };
    }

    /**
     * Create a search template
     * @param {ISearchTemplate} - The JSON required to consturct an Elasticsearch query
     */
    constructor(searchTemplate: ISearchTemplate) {
        // Implement our JSON
        Object.assign(this, searchTemplate);

        Helpers.register(handlebars);
        
        // Compile our template
        this.compiledTemplate = handlebars.compile(this.template);
    }

    /**
     * Render the query template to a string of JSON
     * @param {any} params - The data to pass into the handlebars template
     * @return {string} A search query rendered as a string of JSON
     */
    renderQuery(params: any): string {
        try{
            var query: string = this.compiledTemplate(params);
            return query;
        }catch(err){
            console.error('Failed to render query', err, 'Template:', this.template, 'Parameters:', params, 'Returning match_all instead');
            return '{ "query": { "match_all": { } } }';
        }
    }

    /**
     * Get the head part of a msearch query
     * @return {ISearchHead} A usable head line for an Elasticsearch msearch
     */
    getHead(): ISearchHead {
        return {
            index: this.index,
            type: this.type
        };
    }

    /**
     * Get the body part of an msearch query
     * @param {any} params - The data to pass into the handlebars template
     * @return {any} A usable query line for an Elasticsearch msearch
     */
    getBody(params: any): any {
        try{
            var query: string = this.renderQuery(params);
            var parsed: any = JSON.parse(query);
            return parsed;
        }catch(err){
            console.error('Failed to parse query:', query, 'Returning match_all instead');
            return { query: { match_all: {} } };
        }
    }

    /**
     * Get a standalone query
     * @param {any} params - The data to pass into the handlebars template
     * @return {ISearchQuery} A usable Elasticsearch query payload
     */
    getPrimary(params: any): any {
        var parsed: any = this.getBody(params);
        var payload: ISearchQuery = {
            index: this.index,
            type: this.type,
            body: parsed
        };
        return payload;
    }
}

export class SearchTemplateSet implements ISearchTemplateSet {
    [name: string]: SearchTemplate;
}
