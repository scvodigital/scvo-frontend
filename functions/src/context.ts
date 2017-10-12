// Node imports
import * as util from 'util';

// Module imports
import * as admin from 'firebase-admin';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as sass from 'node-sass';
import { IContext, ILinkTag, IMetaTag, IScriptTag, IMenus, IRoutes, Router, IRouteMatch } from 'scvo-router';

helpers({ handlebars: handlebars });

export class Context implements IContext {
    name: string = '';
    linkTags: ILinkTag[] = [];
    metaTags: IMetaTag[] = [];
    metaData: any = {};
    scriptTags: IScriptTag[] = [];
    menus: IMenus = {};
    routes: IRoutes = {};
    sass: string = '';
    template: string = '';
    
    // Instance specific properties
    private compiledTemplate: (obj: any, hbs?: any) => string = null;
    private compiledCss: string = null;
    private router: Router = null;

    constructor(context: IContext){
        Object.assign(this, context);
        
        // Setup our router
        this.router = new Router(this.routes);
        
        // Compile our templates and CSS
        this.compiledTemplate = handlebars.compile(this.template);
        this.compiledCss = sass.renderSync({ data: this.sass, sourceMap: false, outputStyle: 'compact' }).css.toString('utf8');
    }

    renderPage(uriString: string): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            this.router.execute(uriString).then((routeMatch: IRouteMatch) => {
                var templateData = {
                    linkTags: this.linkTags,
                    metaTags: this.metaTags,
                    metaData: this.metaData,
                    scriptTags: this.scriptTags,
                    menus: this.menus,
                    css: this.compiledCss,
                    routes: this.routes,
                    route: routeMatch,
                    headerTags: this.getHeaderTags(routeMatch)
                };
                console.log('TEMPLATE DATA:', JSON.stringify(templateData, null, 4));
                var contextHtml = this.compiledTemplate(templateData);

                var closingHeadTag = contextHtml.indexOf('</head>');
                if(closingHeadTag > -1){
                    var dataJson = JSON.stringify(templateData, null, 4);
                    dataJson = dataJson.replace(/\<\/script/ig, '</scr" + "ipt');
                    var dataTag = `
                        <script>
                            window.contextData = ${dataJson};
                        </script>
                    `;
                    contextHtml = [contextHtml.slice(0, closingHeadTag), dataTag, contextHtml.slice(closingHeadTag)].join('');
                }

                resolve(contextHtml);
            }).catch((err) => {
                console.error('Failed to render route', err);
                reject(err);
            });
        });
    }
    
    getHeaderTags(routeMatch: IRouteMatch): string {
        var linkTags = {};
        var metaTags = {};

        (this.linkTags || []).forEach((linkTag: ILinkTag) => {
            var key = linkTag.name || 'clt' + Math.floor(Math.random() * 999999);
            var tag = this.renderTag('link', linkTag);
            linkTags[key] = tag;
        });

        (this.metaTags || []).forEach((metaTag: IMetaTag) => {
            var key = metaTag.name || 'cmt' + Math.floor(Math.random() * 999999);
            var tag = this.renderTag('meta', metaTag);
            metaTags[key] = tag;    
        });

        (routeMatch.linkTags || []).forEach((linkTag: ILinkTag) => {
            var key = linkTag.name || 'rlt' + Math.floor(Math.random() * 999999);
            var tag = this.renderTag('link', linkTag);
            linkTags[key] = tag;
        });

        (routeMatch.metaTags || []).forEach((metaTag: IMetaTag) => {
            var key = metaTag.name || 'rmt' + Math.floor(Math.random() * 999999);
            var tag = this.renderTag('meta', metaTag);
            metaTags[key] = tag;    
        });

        var linkTagsHtml = Object.keys(linkTags).map((key: string) => {
            return linkTags[key];
        }).join('\n');

        var metaTagsHtml = Object.keys(metaTags).map((key: string) => {
            return metaTags[key];
        }).join('\n');

        //TODO: Add pagination params and link generators to route and include link tags here
        //TODO: Add some kind of title templating here as well
        
        var headerTags = `
            <!-- Start of Generated Route Header Tags -->
            ${linkTagsHtml}
            ${metaTagsHtml}
            <!-- End of Generated Route Header Tags -->
        `;

        return headerTags;
    }

    renderTag(tagName: string, attributes: { [key: string]: string }): string {
        var keyValuePairs: string[] = [];
        Object.keys(attributes).forEach((key: string) => {
            var pair = `${key}="${attributes[key]}"`;
            keyValuePairs.push(pair);
        });
        var attributesString = keyValuePairs.join(' ');
        var tag = `<${tagName} ${attributesString} data-route-generated="true">`;
        return tag;
    }
}
