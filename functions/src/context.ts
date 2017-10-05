// Node imports
import * as util from 'util';

// Module imports
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as sass from 'node-sass';
import { IContext, ILinkTag, IMetaTag, IScriptTag, IMenus, IRoutes, Router, RouteMatch } from 'scvo-router';

helpers({ handlebars: handlebars });

export class Context implements IContext {
    name: string = '';
    linkTags: ILinkTag[] = [];
    metaTags: IMetaTag[] = [];
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
            this.router.execute(uriString).then((routeMatch: RouteMatch) => {
                var templateData = {
                    routeHtml: routeMatch.rendered,
                    linkTags: this.linkTags,
                    metaTags: this.metaTags,
                    scriptTags: this.scriptTags,
                    menus: this.menus,
                    css: this.compiledCss
                };
                var contextHtml = this.compiledTemplate(templateData);
                resolve(contextHtml);
            }).catch((err) => {

            });
        });
    }
}
