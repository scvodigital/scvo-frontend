import { SearchResponse, ConfigOptions } from 'elasticsearch';
export interface IJsonable {
    toJSON(): any;
}
export interface IContext {
    name: string;
    domains: string[];
    metaData: any;
    menus: IMenus;
    routes: IRoutes;
    template: string;
    uaId: string;
    templatePartials: IPartials;
    layouts: ILayouts;
}
export interface ILayouts {
    default: ILayout;
    [name: string]: ILayout;
}
export interface ILayout {
    template: string;
    sections: string[];
    pattern: string;
    contentType: string;
    doNotStripDomains: boolean;
}
export interface IPartials {
    [name: string]: string;
}
export interface IMenus {
    [name: string]: IMenuItem[];
}
export interface IMenuItem {
    label: string;
    path: string;
    route: string;
    children: IMenuItem[];
    metaData: any;
    level?: number;
    match?: boolean;
}
export interface IMenuItemMatch extends IMenuItem {
    children: IMenuItemMatch[];
    dotPath: string;
    order: number;
    level: number;
    match: boolean;
}
export interface IRoutes {
    [name: string]: IRoute;
}
export interface IRoute {
    name: string;
    metaData: any;
    pattern: string | INamedPattern;
    queryDelimiter: string;
    queryEquals: string;
    primarySearchTemplate: ISearchTemplate;
    supplimentarySearchTemplates: ISearchTemplateSet;
    elasticsearchConfig: ConfigOptions;
    defaultParams: any;
    context: IContext;
    layouts: IRouteLayouts;
}
export interface IRouteLayouts {
    default: IRouteLayout;
    [name: string]: IRouteLayout;
}
export interface IRouteLayout {
    [section: string]: string;
}
export interface INamedTemplate {
    [name: string]: string;
}
export interface INamedPattern {
    [suffix: string]: string;
}
export interface IRouteMatch extends IRoute {
    params: any;
    primaryResponse: SearchResponse<IDocumentResult>;
    supplimentaryResponses: ISearchResponseSet;
    paging: IPaging;
    layoutName: string;
    response: IRouteResponse;
}
export interface IElasticsearchConfig {
    username: string;
    password: string;
    host: string;
}
export interface ISearchTemplateSet {
    [name: string]: ISearchTemplate;
}
export interface ISearchTemplate {
    index: string;
    type: string;
    template: string;
}
export interface ISearchHead {
    index: string;
    type: string;
}
export interface ISearchQuery {
    index: string;
    type: string;
    body: any;
}
export interface IPaging {
    from?: number;
    size?: number;
    sort?: any;
    totalResults?: number;
    totalPages?: number;
    currentPage?: number;
    nextPage?: number;
    prevPage?: number;
    pageRange?: IPagingPage[];
}
export interface IPagingPage {
    pageNumber: number;
    distance: number;
}
export interface IDocumentResult {
    Id: string;
    author: string;
    description: string;
    tags: string[];
    title: string;
    og_title: string;
    og_description: string;
    og_image: string;
    views: IViews;
    date_publishes: Date;
    date_expires: Date;
    date_modified: Date;
    date_index_updated: Date;
    text_bag: string;
    json_ld: any;
    geo_info: IGeoInfo[];
}
export interface IViews {
    [name: string]: string;
}
export interface ISearchResponseSet {
    [name: string]: SearchResponse<IDocumentResult>;
}
export interface IGeoInfo {
    title: string;
    description: string;
    geo_point: IGeoPoint;
    primary: boolean;
    address: string;
    postcode: string;
    details: IGeoDetails;
}
export interface IGeoPoint {
    lat: number;
    lon: number;
}
export interface IGeoDetails {
    postcode: string;
    quality: number;
    eastings: number;
    northings: number;
    country: string;
    nhs_ha: string;
    longitude: number;
    latitude: number;
    european_electoral_region: string;
    primary_care_trust: string;
    region: string;
    lsoa: string;
    msoa: string;
    incode: string;
    outcode: string;
    parliamentary_constituency: string;
    admin_district: string;
    parish: string;
    admin_county: string;
    admin_ward: string;
    ccg: string;
    nuts: string;
    codes: {
        admin_district: string;
        admin_county: string;
        admin_ward: string;
        parish: string;
        parliamentary_constituency: string;
        ccg: string;
        nuts: string;
    };
}
export interface IRouteResponse {
    contentType: string;
    contentBody: string;
    statusCode: number;
}
