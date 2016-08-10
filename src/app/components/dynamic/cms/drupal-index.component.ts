import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { DrupalService } from '../../../services/drupal.service';
import { AppService } from '../../../services/app.service';

import { MarkdownPipe } from '../../../pipes/markdown.pipe';

import { DrupalPageComponent } from './drupal-page.component';
import { DrupalPostComponent } from './drupal-post.component';
// import { MenuItemsComponent } from '../../shared/header/menu-items.component';

@Component({
    selector: 'cms-index',
    templateUrl: 'app/components/dynamic/cms/drupal-index.component.html',
    providers: [AppService, DrupalService],
    directives: [ROUTER_DIRECTIVES, SlimLoadingBar, DrupalPageComponent, DrupalPostComponent],
    pipes: [MarkdownPipe]
})
export class DrupalIndexComponent implements OnInit {
    pages: Observable<any>;
    posts: Observable<any>;
    parent: String;
    error: Boolean = false;
    error_message: Observable<any>;
    public navigationMenu: Object;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        this.navigationMenu = _appService.navigationMenu;
    }

    ngOnInit() {
        this.route.url.subscribe((params) => {
            this.slimLoadingBarService.start();
            this.parent = params[0].path;

            var requestPath = params.join('/');

            console.log('Get term ID for: '+requestPath);
            // This is probably not the best way to do it, but the Drupal API doesn't provide a nice way to get tid from term name or path
            var term_id = 0;
            for (var level1 in this.navigationMenu) {
                // console.log(level1, this.navigationMenu[level1]);
                if (term_id == 0) {
                    if (this.navigationMenu[level1].path == '/'+requestPath) {
                        // console.log("Match!");
                        term_id = this.navigationMenu[level1].term_id;
                    } else {
                        for (var level2 in this.navigationMenu[level1].contents) {
                            if (term_id == 0) {
                                // console.log(level2, this.navigationMenu[level1].contents[level2]);
                                if (this.navigationMenu[level1].contents[level2].path == '/'+requestPath) {
                                    // console.log("Match!");
                                    term_id = this.navigationMenu[level1].contents[level2].term_id;
                                }
                            }
                        }
                    }
                }
            }

            console.log('Asking Drupal for list of sub-pages from /'+requestPath);

            this._drupalService.request('pages/'+term_id).subscribe(content => {
                this.pages = content;
            },
            err => {
                this.error = true;
                this.error_message = err;
            });
            this._drupalService.request('posts/'+term_id).subscribe(content => {
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
