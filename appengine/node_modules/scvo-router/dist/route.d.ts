import { ConfigOptions } from 'elasticsearch';
import { IRoute, ISearchTemplateSet, IJsonable, INamedPattern, INamedTemplate, IContext, IRouteLayouts } from './interfaces';
import { SearchTemplate } from './search-template';
/** Class that handles a route match, implements search templates and gets results */
export declare class Route implements IRoute, IJsonable {
    context: IContext;
    name: string;
    metaData: any;
    pattern: string | INamedPattern;
    queryDelimiter: string;
    queryEquals: string;
    templates: INamedTemplate;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: ISearchTemplateSet;
    elasticsearchConfig: ConfigOptions;
    layouts: IRouteLayouts;
    defaultParams: any;
    toJSON(): IRoute;
    readonly defaultParamsCopy: any;
    /**
     * Create a Route
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    constructor(route: IRoute, context: IContext);
}
