import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { MaterializeAction } from 'angular2-materialize';

import { AppService } from '../../../services/app.service';
import { SiteComponent } from '../../../common/base.component';

declare var SimpleMDE: any;

@Component({
    selector: 'app-translations-manager',
    templateUrl: './translations-manager.component.html'
})
export class TranslationsManagerComponent extends SiteComponent {
    get languages(){
        if(!this.appService || !this.appService.config){
            return [];
        }else{
            return this.appService.config.languages;
        }
    }

    get keys(){
        if(!this.appService || !this.appService.translations){
            return {};
        }else{
            return this.appService.translations;
        }
    }

    searchTerm: string = null;

    get filtered(){
        if(!this.searchTerm){
            return this.keys;
        }

        var found = {};

        Object.keys(this.keys).forEach((key) => {
            var item = this.keys[key];
            if(this.searchMatch(this.searchTerm, key)){
                found[key] = item;
            }else{
                var match = false;
                Object.keys(item).forEach((translation) => {
                    if(this.searchMatch(this.searchTerm, item[translation])){
                        match = true;
                    }
                });
                if(match){
                    found[key] = item;
                }
            }
        });

        return found;
    }

    searchMatch(needle: string, haystack: string): boolean{
        var match = false;

        needle = needle.toLowerCase();
        haystack = haystack.toLowerCase();

        var needles = needle.split(/\b/g);

        for(var i = 0; i < needles.length; i++){
            if(haystack.indexOf(needles[i]) !== -1){
                match = true;
                break;
            }
        }

        return match;
    }

    constructor(appService: AppService) { super(appService); }

    onSiteLoaded() {
    }

    // toasterActions = new EventEmitter<string | MaterializeAction>();

    onEdit(value, key, language){
        this.keys[key][language] = value;
        this.appService.saveTranslations().then(() => {
            // this.toasterActions.emit({ action: 'toast', params: ['Translation saved', 4000, 'green white-text'] });
        }).catch((err) => {
            console.error('Failed to save translation', key, language, value, err);
            // this.toasterActions.emit({ action: 'toast', params: ['Translation failed to save', 4000, 'red white-text'] });
        });
    }
}
