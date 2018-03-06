import { ISearchTemplate, ISearchTemplateSet, ISearchHead, IJsonable } from './interfaces';
/** Class to construct an Elasticsearch query */
export declare class SearchTemplate implements ISearchTemplate, IJsonable {
    index: string;
    type: string;
    template: string;
    private compiledTemplate;
    toJSON(): ISearchTemplate;
    /**
     * Create a search template
     * @param {ISearchTemplate} - The JSON required to consturct an Elasticsearch query
     */
    constructor(searchTemplate: ISearchTemplate);
    /**
     * Render the query template to a string of JSON
     * @param {any} params - The data to pass into the handlebars template
     * @return {string} A search query rendered as a string of JSON
     */
    renderQuery(params: any): string;
    /**
     * Get the head part of a msearch query
     * @return {ISearchHead} A usable head line for an Elasticsearch msearch
     */
    getHead(): ISearchHead;
    /**
     * Get the body part of an msearch query
     * @param {any} params - The data to pass into the handlebars template
     * @return {any} A usable query line for an Elasticsearch msearch
     */
    getBody(params: any): any;
    /**
     * Get a standalone query
     * @param {any} params - The data to pass into the handlebars template
     * @return {ISearchQuery} A usable Elasticsearch query payload
     */
    getPrimary(params: any): any;
}
export declare class SearchTemplateSet implements ISearchTemplateSet {
    [name: string]: SearchTemplate;
}
