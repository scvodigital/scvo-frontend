import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { MaterializeAction } from 'angular2-materialize';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { AppService } from '../../../services/app.service';
import { SiteComponent } from '../../../common/base.component';

import * as SimpleMDE from 'simplemde';
import { SimpleMDEOptions } from '../../../configuration/simplemde';

declare var $: any;

@Component({
    selector: 'app-page-list',
    templateUrl: './page-editor.component.html'
})
export class PageEditorComponent extends SiteComponent {
    pageName: string = 'Loading page';
    get translations(): { [language: string]: string } {
        if (!this.appService.site || !this.appService.site.pages.hasOwnProperty(this.pageName)) {
            var empty = {};
            this.languages.forEach((language) => {
                empty[language] = '';
            });
            return empty;
        } else {
            return this.appService.site.pages[this.pageName];
        }
    }

    get languages(): string[] {
        if(!this.appService.config){
            return [];
        }else{
            return this.appService.config.languages;
        }
    }

    _selectedLanguage: string;
    get selectedLanguage(): string {
        return this._selectedLanguage;
    }
    set selectedLanguage(value: string){
        this._selectedLanguage = value;
        var markdown = "";
        if (this.appService.site && this.appService.site.pages.hasOwnProperty(this.pageName)) {
            var page = this.appService.site.pages[this.pageName];
            if(page.hasOwnProperty(value)){
                markdown = page[value];
            }
        }
        this.editor.value(markdown);
    }

    constructor(appService: AppService, private route: ActivatedRoute) { super(appService); }

    editor: any;
    // toasterActions = new EventEmitter<string | MaterializeAction>();

    onSiteLoaded() {
        this.route.params.subscribe(params => {
            this.pageName = params['id'];

            var config = Object.create(SimpleMDEOptions);
            config['editor'] = $('#page-editor')[0];
            this.editor = new SimpleMDE(config);
            this.editor.codemirror.on('change', () => {
                this.translations[this.selectedLanguage] = this.editor.value();
            });
        });
    }

    save(){
        this.appService.savePage(this.pageName).then(() => {
            // this.toasterActions.emit({ action: 'toast', params: ['Page saved', 4000, 'green white-text'] });
        }).catch((err) => {
            console.error('Error saving page', err);
            // this.toasterActions.emit({ action: 'toast', params: ['Error saving page', 4000, 'red white-text'] });
        });
    }

    rendered(markdown){
        var kthp = new MarkdownToHtmlPipe();
        var html = kthp.transform(markdown, {breaks: true});
        return html;
    }
}
