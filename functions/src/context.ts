// Node imports
import * as util from 'util';

// Module imports
import * as admin from 'firebase-admin';
import { 
    IContext, IMenus, IRoutes, Router, IRouteMatch, 
    IPartials, Helpers, ILayouts, ILayout
} from 'scvo-router';


export class Context implements IContext {
    name: string = '';
    domains: string[] = [];
    metaData: any = {};
    menus: IMenus = {};
    routes: IRoutes = {};
    templatePartials: IPartials = {};
    uaId: string = '';
    layouts: ILayouts;

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
            menus: this.menus,
            routes: this.routes,
            uaId: this.uaId,
            userId: this.userId,
            templatePartials: this.templatePartials,
            layouts: this.layouts
        }
    }

    private router: Router = null;

    constructor(context: IContext, public userId: any){
        Object.assign(this, context);

        // Setup our router
        this.router = new Router(this.toJSON, this.uaId, userId, true);
    }

    renderPage(uriString: string): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            this.router.execute(uriString).then((routeMatch: string) => {
                routeMatch = routeMatch.replace(this.domainStripper, '');
                resolve(routeMatch);
            }).catch((err) => {
                console.error('Failed to render route', err);
                reject(err);
            });
        });
    }
}
