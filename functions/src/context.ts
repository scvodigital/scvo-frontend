// Node imports
import * as util from 'util';

// Module imports
import * as admin from 'firebase-admin';
import * as handlebars from 'handlebars';
const hbs = require('clayhandlebars')();
import * as sass from 'node-sass';
import * as uglify from 'uglify-js';
import { IContext, ILinkTag, IMetaTag, IScriptTag, IMenus, IRoutes, Router, IRouteMatch, IPartials, Helpers } from 'scvo-router';

Helpers.register(hbs);

export class Context implements IContext {
    name: string = '';
    domains: string[] = [];
    metaData: any = {};
    scriptTags: IScriptTag[] = [];
    menus: IMenus = {};
    routes: IRoutes = {};
    sass: string = '';
    template: string = '';
    templatePartials: IPartials = {};
    uaId: string = '';
    javascript: string = '';

    _domainStripper: RegExp = null;
    get domainStripper(): RegExp {
        if(!this._domainStripper){
            var stripDomains = this.domains.map((domain: string) => { return domain.replace(/\./g, '\\.'); });
            var domainRegexString = '((https?)?:\\/\\/)((' + stripDomains.join(')|(') + '))';
            this._domainStripper = new RegExp(domainRegexString, 'ig');
        }
        return this._domainStripper;
    }

    get toJSON(): IContext {
        return {
            name: this.name,
            domains: this.domains,
            metaData: this.metaData,
            scriptTags: this.scriptTags,
            menus: this.menus,
            routes: this.routes,
            sass: this.sass,
            template: this.template,
            uaId: this.uaId,
            userId: this.userId,
            templatePartials: this.templatePartials
        }
    }

    // Instance specific properties
    private compiledTemplate: (obj: any, hbs?: any) => string = null;
    private compiledCss: string = null;
    private router: Router = null;

    constructor(context: IContext, public userId: any){
        Object.assign(this, context);

        // Setup our router
        this.router = new Router(this.toJSON, this.uaId, userId, true);

        // Compile our templates and CSS
        this.compiledTemplate = hbs.compile(this.template);
        Object.keys(context.templatePartials).forEach((name: string) => {
            hbs.registerPartial(name, context.templatePartials[name]);
        });

        this.compiledCss = sass.renderSync({ data: this.sass, sourceMap: false, outputStyle: 'compact' }).css.toString('utf8');
    }

    renderPage(uriString: string): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            this.router.execute(uriString).then((routeMatch: IRouteMatch) => {
                if(routeMatch.templateName !== 'default'){
                    return resolve(routeMatch.rendered);
                }
                
                var templateData = {
                    metaData: this.metaData,
                    scriptTags: this.scriptTags,
                    domains: this.domains,
                    menus: this.menus,
                    css: this.compiledCss,
                    routes: this.routes,
                    route: routeMatch,
                    uaId: this.uaId,
                    templatePartials: this.templatePartials,
                };

                var contextHtml = this.compiledTemplate(templateData);

                var closingHeadTag = contextHtml.indexOf('</head>');
                if(closingHeadTag > -1){
                    var tags = `
                        ${routeMatch.headTags}
                        <script>
                            document.addEventListener("DOMContentLoaded", function(event) {
                                //Context Javascript
                                ${this.javascript}

                                //Route Javascript
                                ${routeMatch.javascript}
                            });
                        </script>
                    `;
                    contextHtml = [contextHtml.slice(0, closingHeadTag), tags, contextHtml.slice(closingHeadTag)].join('');
                }

                contextHtml = contextHtml.replace(this.domainStripper, '');

                resolve(contextHtml);
            }).catch((err) => {
                console.error('Failed to render route', err);
                reject(err);
            });
        });
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
