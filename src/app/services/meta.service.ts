import { Injectable, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';
//import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

import * as deepmerge from 'deepmerge';

declare var $;

@Injectable()
export class MetaService {
    /**
     * <head> Element of the HTML document
     */
    private headElement: JQuery;
    /**
     * <title> Element of the HTML document
     */
    private titleElement: JQuery;

    private elementGroups: { [key: string]: { [name: string]: JQuery } } = {
        title: {
            'title': null,
            'twitter:title': null,
            'og:title': null
        },
        description: {
            'description': null,
            'twitter:description': null,
            'og:description': null
        },
        twitterHandle: {
            'twitter:site:id': null,
            'twitter:creator:id': null
        },
        colour: {
            'theme-color': null,
            'msapplication-navbutton-color': null,
            'apple-mobile-web-app-status-bar-style': null
        }
    };

    private _defaults: IMetaDefaults;

    public setDefaults(data: IMetaDefaults){
        this._defaults = data;
    }

    private _defaultJsonLd: any = {};
    public setDefaultJsonLd(data: any){
        this._defaultJsonLd = data;
    }

    constructor(private titleService: Title, @Inject(Router) private router: Router) {
        this.headElement = $('head');
        this.titleElement = $('title');

        Object.keys(this.elementGroups).forEach((group) => {
            Object.keys(this.elementGroups[group]).forEach((name) => {
                this.elementGroups[group][name] = this.getOrCreateMetaElement(name);
            });
        });

        this.router.events.subscribe((event) => {
            if(event instanceof NavigationStart){
                this.setMeta(this._defaults);
                this.setJsonLd(this._defaultJsonLd);
            }
        });
    }

    public setMeta(meta: IMetaDefaults) {
        var data: IMetaDefaults = {};
        data.title = meta.title || this._defaults.title;
        data.description = meta.description || this._defaults.description;
        data.twitterHandle = meta.description || this._defaults.twitterHandle;

        Object.keys(data).forEach((groupName) => {
            var group = this.elementGroups[groupName];
            var value = data[groupName];

            Object.keys(group).forEach((name) => {
                group[name].attr('content', value);
            });

            if (groupName === 'title') {
                this.titleElement.text(value);
            }
        });
    }

    public getMeta(groupName: string): string {
        if (!this.elementGroups.hasOwnProperty('groupName')) {
            return '';
        }

        var group = this.elementGroups[groupName];
        var first = Object.keys(group)[0];
        return group[first].attr('content');
    }

    /**
     * get the HTML Meta Element when it is in the markup, or create it.
     * @param name
     * @returns {HTMLMetaElement}
     */
    private getOrCreateMetaElement(name: string): JQuery {
        let el: JQuery;
        el = $('meta[name="' + name + '"]');
        if (el.length === 0) {
            el = $('<meta />');
            el.attr('name', name);
            this.headElement.append(el);
        }
        return el;
    }

    public setJsonLd(data){
        let el: JQuery;
        el = $('head script[type="application/ld+json"]');
        if(el.length === 0){
            el = $('<script />');
            el.attr('type', 'application/ld+json');
            this.headElement.append(el);
        }

        var jsonLd = deepmerge(data, {
            '@context': 'http://schema.org',
            url: location.href
        });

        if(!jsonLd.hasOwnProperty('@type')){
            jsonLd['@type'] = 'WebPage';
        }

        el.text('\n' + JSON.stringify(jsonLd, null, 4) + '\n');
        return el;
    }
}

export interface IMetaDefaults{
    title?: string;
    description?: string;
    twitterHandle?: string;
}
