// Module imports
import { ConfigOptions } from 'elasticsearch';

// Internal imports
import { 
    IRoute, ISearchTemplate, ISearchTemplateSet, IJsonable, 
    INamedPattern, INamedTemplate, IContext, IRouteLayouts,
    IRouteLayout
} from './interfaces';
import { SearchTemplate } from './search-template';
import { MapJsonify } from './map-jsonify';

/** Class that handles a route match, implements search templates and gets results */
export class Route implements IRoute, IJsonable {
    name: string = '_default';
    metaData: any = {};
    pattern: string|INamedPattern = '';
    queryDelimiter: string = '&';
    queryEquals: string = '=';
    templates: INamedTemplate = { default: '' };
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: ISearchTemplateSet = {};
    elasticsearchConfig: ConfigOptions = null;
    layouts: IRouteLayouts = null;
    defaultParams: any = {};

    public toJSON(): IRoute{
        var templates = MapJsonify<ISearchTemplate>(this.supplimentarySearchTemplates);
        return {
            name: this.name,
            metaData: this.metaData,
            pattern: this.pattern,
            queryDelimiter: this.queryDelimiter,
            queryEquals: this.queryEquals,
            primarySearchTemplate: this.primarySearchTemplate.toJSON(),
            supplimentarySearchTemplates: templates,
            elasticsearchConfig: this.elasticsearchConfig,
            defaultParams: this.defaultParams,
            layouts: this.layouts,
            context: this.context
        };
    }

    get defaultParamsCopy(): any {
        var copy = {};
        Object.assign(copy, this.defaultParams);
        return copy;
    }

    /**
     * Create a Route 
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    constructor(route: IRoute = null, public context: IContext){
        if(route){
            // If given an IRoute, implement it
            Object.assign(this, route);
        }

        // Upgrade our JSON to real classes
        this.primarySearchTemplate = new SearchTemplate(this.primarySearchTemplate);
        Object.keys(this.supplimentarySearchTemplates).forEach((key: string) => {
            this.supplimentarySearchTemplates[key] = new SearchTemplate(this.supplimentarySearchTemplates[key]);
        });
    }
}
