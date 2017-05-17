import { Injectable, Type, Inject } from '@angular/core';
import { Router, Route } from '@angular/router';

import { Observable, Subject, Subscription, Observer } from 'rxjs/Rx';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { ElasticService } from '../services/elastic.service';
// import { MetaService } from '../services/meta.service';
import { SlugifyPipe } from '../pipes/slugify.pipe';

import * as md5 from 'md5';

declare function loaded();
// declare var baseDb: {
//     sites: ISite,
//     config: IAppConfig
// }

@Injectable()
export class AppService {
    private configObs: FirebaseObjectObservable<IAppConfig>;
    private configSub: Subscription;
    public config: IAppConfig;// = baseDb.config;

    private translationsObs: FirebaseObjectObservable<ITranslations>;
    private translationsSub: Subscription;
    public translations: ITranslations;// = baseDb.translations;

    // private userObs: FirebaseObjectObservable<IUser>;
    // private userSub: Subscription;
    // public user: SiteUser = new SiteUser({});
    // public userAuth: any;

    public ready: boolean = false;
    public readySub: Subject<void> = new Subject<void>();

    private get domainKey(): string {
        return location.hostname.replace(/\./g, '-');
    }

    private get siteKey(): string {
        if (this.config === null) return null;
        return this.config.domains[this.domainKey];
    }

    private siteObs: FirebaseObjectObservable<ISite>;
    private siteSub: Subscription;
    public site: ISite;// = baseDb.sites[this.siteKey];

    public get sitePath(): string {
        return '/sites/' + this.siteKey + '/';
    }

    constructor(@Inject(AngularFire) public af: AngularFire, @Inject(ElasticService) public es: ElasticService, @Inject(Angulartics2GoogleAnalytics) public ga: Angulartics2GoogleAnalytics) {

        //, @Inject(MetaService) public ms: MetaService

        // this.ga.setUserProperties({
        //     siteKey: this.siteKey
        // });

        this.loadSiteData();
    }

    private loadSiteData(){
        this.configObs = this.af.database.object('/config', { preserveSnapshot: true });
        this.configSub = this.configObs.subscribe((configObj: any) => {
            this.config = configObj.val();

            this.translationsObs = this.af.database.object('/translations', { preserveSnapshot: true });
            this.translationsSub = this.translationsObs.subscribe((translationsObj: any) => {
                this.translations = translationsObj.val();

                this.siteObs = this.af.database.object(this.sitePath, { preserveSnapshot: true });
                this.siteSub = this.siteObs.subscribe((siteObj: any) => {
                    this.site = siteObj.val();

                    this.refreshMenus();

                    this.ready = true;
                    this.readySub.next();

                    loaded();
                });
            });
        });
    }

    private _menus: { [key: string]: MenuElement[] } = {};
    public get menus(): { [key: string]: MenuElement[] } {
        return this._menus;
    }
    public set menus(value: { [key: string]: MenuElement[] }) {
        this._menus = value;
    }

    private _allMenus: { [key: string]: MenuElement[] } = {};
    public get allMenus(): { [key: string]: MenuElement[] } {
        return this._allMenus;
    }
    public set allMenus(value: { [key: string]: MenuElement[] }) {
        this._allMenus = value;
    }

    public refreshMenus(){
        if(!this.site || !this.site.menus || !this.menus){
            return {};
        }

        var roles = ['unauthenticated', 'all'];
        var newMenus = {};
        var newAllMenus = {};

        Object.keys(this.site.menus).forEach((key) => {
            newMenus[key] = [];
            newAllMenus[key] = [];
            this.site.menus[key].forEach((item) => {
                if (!item.submenu) item.submenu = [];
                newAllMenus[key].push(new MenuElement(item.path, item.roles, item.submenu));
                var found = roles.some((v: string) => {
                    return item.roles.indexOf(v) >= 0;
                });
                if(found){
                    newMenus[key].push(new MenuElement(item.path, item.roles, item.submenu));
                }
            });
        });

        this.menus = newMenus;
        this.allMenus = newAllMenus;
    }

    public get language(): string {
        if(!this.ready){
            return 'en';
        }
        return this.site.config.defaultLanguage;
    }

    public set language(value: string) {
        if(this.config.languages.indexOf(value) >= 0){
            // this.user.language = value;
            // this.updateUser();
        }
    }

    public getPhrase(key: string) : string{
        this.addTranslation(key);

        if(!this.ready || !this.translations || !this.translations.hasOwnProperty(key)){
            return key;
        }

        if(this.translations[key].hasOwnProperty(this.language)){
            return this.translations[key][this.language];
        }

        if(this.translations[key].hasOwnProperty(this.site.config.defaultLanguage)){
            return this.translations[key][this.site.config.defaultLanguage];
        }

        var languages = Object.keys(this.translations[key]);
        if(languages.length > 0){
            return this.translations[key][languages[0]];
        }

        return key;
    }

    public getSpecificPhrase(key: string, language: string){
        this.addTranslation(key);

        if(!this.ready || !this.translations.hasOwnProperty(key)){
            return key;
        }

        if(this.translations[key].hasOwnProperty(language)){
            return this.translations[key][language];
        }

        if(this.translations[key].hasOwnProperty(this.language)){
            return this.translations[key][language];
        }

        return key;
    }

    private _unsavedTranslations: boolean = false;
    public get unsavedTranslations(): boolean {
        // if(this.user && this.user.roles && this.user.roles.indexOf('Administrator') > -1){
        //     return this._unsavedTranslations;
        // }else{
        //     return false;
        // }
        return false;
    }

    public addTranslation(key){
        if(this.ready && this.translations && !this.translations.hasOwnProperty(key)){
            // if(this.user && this.user.roles && this.user.roles.indexOf('Administrator') > -1){
                this.translations[key] = {};
                this.config.languages.forEach((language) => {
                    this.translations[key][language] = key;
                });
                this._unsavedTranslations = true;
            // }
        }
    }

    public getPage(path: string) {
        if (!this.ready) {
            return '';
        }

        var key = '_' + path.replace(/\//g, '_');

        if (!this.site.pages.hasOwnProperty(key)) {
            return '404: Not found';
        }

        if (this.site.pages[key].hasOwnProperty(this.site.config.defaultLanguage)) {
            return this.site.pages[key][this.site.config.defaultLanguage];
        }

        var languages = Object.keys(this.site.pages[key]);

        if (languages.length > 0) {
            return this.site.pages[key][0];
        }

        return '';
    }

    public getSpecificPage(path: string, language: string) {
        if (!this.ready) {
            return '';
        }

        var key = '_' + path.replace(/\//g, '_');

        if (!this.site.pages.hasOwnProperty(key)) {
            return '404: Not found';
        }

        if (this.site.pages[key].hasOwnProperty(language)) {
            return this.site.pages[key][language];
        }

        return '';
    }

    public saveMenu(){
        return new Promise((resolve, reject) => {
            var menusObs = this.af.database.object(this.sitePath + '/menus', { preserveSnapshot: true });
            var menusSub = menusObs.set(this.allMenus).then((response) => {
                this.refreshMenus();
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public savePage(pageName){
        return new Promise((resolve, reject) => {
            var pageObs = this.af.database.object(this.sitePath + '/pages/' + pageName, { preserveSnapshot: true });
            var pageSub = pageObs.set(this.site.pages[pageName]).then((resonse) => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public saveTranslations(){
        return new Promise((resolve, reject) => {
            this.translationsObs.set(this.translations).then((response) => {
                this._unsavedTranslations = false;
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private _searchFields: ISearchFields = {};
    public get searchFields(): ISearchFields {
        return this._searchFields;
    }
    public set searchFields(value: ISearchFields) {
        this._searchFields = value;
    }
    public refreshSearchFields(){
        return new Promise((resolve, reject) => {
            this.es.getTermCounts().then((response: any) => {
                if (!response.aggregations) {
                    resolve({});
                    return;
                }

                var fields = { };
                var slugify = new SlugifyPipe();

                Object.keys(response.aggregations).forEach((field) => {
                    fields[field] = [];
                    response.aggregations[field].buckets.forEach((bucket) => {
                        fields[field].push({
                            term: bucket.key,
                            count: bucket.doc_count
                        });
                    });
                });

                this.searchFields = fields;
                resolve(fields);
            });
        });
    }

    public getTerms(field: string): ISearchTerm[] {
        if (this.searchFields.hasOwnProperty(field)) {
            return this.searchFields[field];
        } else {
            return [];
        }
    }
}

export interface ISearchFields {
    [field: string]: ISearchTerm[];
}

export interface ISearchTerm {
    term: string;
    count: number;
}

export interface IMenuElement {
    path: string;
    roles: string[];
    submenu: string[];
}

export class MenuElement {
    public get name(): string {
        return this.path.replace(/_/g, '/');
    }
    public get label(): string {
        return 'menu:-' + this.path;
    }
    constructor(public path: string, public roles: string[], public submenu: string[]) { }
}

export interface IAppConfig {
    domains: { [domain: string]: string };
    languages: string[];
    roles: string[];
}

export interface ITranslations {
    [key: string]: { [language: string]: string; }
}

export interface IPage {
    [language: string]: string;
}

export interface ISite {
    config: ISiteConfig;
    menus: { [key: string]: IMenuElement[] };
    pages: { [key: string]: IPage };
}

export interface ISiteConfig {
    defaultDomain: string;
    defaultLanguage: string;
}
