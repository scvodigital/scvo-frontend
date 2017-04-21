import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// import { MaterializeDirective, MaterializeAction } from "angular2-materialize";

import { AppService } from '../../../services/app.service';
import { SiteComponent } from '../../../common/base.component';

@Component({
    selector: 'app-page-list',
    templateUrl: './page-list.component.html'
})
export class PageListComponent extends SiteComponent {
    get pages(){
        if(!this.appService || !this.appService.site){
            return [];
        }else{
            return Object.keys(this.appService.site.pages);
        }
    }

    constructor(appService: AppService, private router: Router) { super(appService); }

    onSiteLoaded() {
    }

    // modalNewActions = new EventEmitter<string | MaterializeAction>();
    newPage: string = null;
    newPageError: string = null;

    showNewPage(){
        this.newPage = null;
        this.newPageError = null;
        // this.modalNewActions.emit({ action: "modal", params: ['open'] });
    }

    createPage(){
        if(!this.newPage){
            this.newPageError = 'You must enter a path';
            return;
        }

        if(this.newPage.charAt[0] != '/'){
            this.newPage = '/' + this.newPage;
        }

        var path = this.newPage.replace(/\//g, '_');
        if(this.appService.site.pages.hasOwnProperty(path)){
            this.newPageError = 'A page with the path "' + this.newPage + '" already exists';
            return;
        }else{
            this.appService.site.pages[path] = {};
            this.appService.config.languages.forEach((language) => {
                this.appService.site.pages[path][language] = '';
            });
            this.newPageError = null;
            this.newPage = null;

            this.appService.savePage(path).then(() => {
                this.router.navigate(['/admin/page-editor', path]);
                // this.modalNewActions.emit({ action: "modal", params: ['close'] });
                // this.modalNewActions.emit({ action: 'toast', params: ['Menu updated', 4000, 'green white-text'] });
            }).catch((err) => {
                this.newPageError = err;
                // this.modalNewActions.emit({ action: 'toast', params: ['Error creating new page', 4000, 'red white-text'] });
            });
        }
    }
}
