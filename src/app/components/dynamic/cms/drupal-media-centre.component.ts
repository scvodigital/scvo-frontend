import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { DrupalService } from '../../../services/drupal.service';
import { AppService } from '../../../services/app.service';

import { MarkdownPipe } from '../../../pipes/markdown.pipe';

import { DrupalPageComponent } from './drupal-page.component';
import { DrupalPostComponent } from './drupal-post.component';
// import { MenuItemsComponent } from '../../shared/header/menu-items.component';

@Component({
    selector: 'cms-media-centre',
    templateUrl: './drupal-media-centre.component.html'
})
export class DrupalMediaCentreComponent implements OnInit {
    private settings: Object;
    private navigation: Object;

    pages: Observable<any>;
    posts: Observable<any>;
    parent: String;
    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        this.settings = _appService.getSettings();
        this.navigation = _appService.getNavigation();
    }

    ngOnInit() {
        this.route.url.subscribe((params) => {
            this.slimLoadingBarService.start();
            this.parent = params[0].path;

            var term_id = 62;

            this._drupalService.request(this.settings['cmsAddress']+'pages/'+term_id).subscribe(content => {
                this.pages = content;
            },
            err => {
                this.error = true;
                this.error_message = err;
            });

            this._drupalService.request(this.settings['cmsAddress']+'posts/'+term_id).subscribe(content => {
                this.posts = content;
            },
            err => {
                this.error = true;
                this.error_message = err;
            });

            this.slimLoadingBarService.complete();
        });
    }
}
