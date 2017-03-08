import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { DrupalService } from '../../../services/drupal.service';
import { AppService } from '../../../services/app.service';

import { MapToIterablePipe } from '../../../pipes/map-to-iterable.pipe';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';

// import { DrupalPostListComponent } from './drupal-post-list.component';

@Component({
    selector: 'cms-page',
    templateUrl: './drupal-page.component.html',
})
export class DrupalPageComponent implements OnInit {
    private settings: Object;
    private categories: Object;
    private tags: Object;

    content: Observable<any>;

    content_status: Observable<any>;
    content_nid: Observable<any>;
    content_type: Observable<any>;
    content_revision_timestamp: Observable<any>;
    content_title: Observable<any>;
    content_subheading: Observable<any>;
    content_body: Observable<any>;
    content_body_format: Observable<any>;
    content_category: Observable<any>;
    content_subcategory: Observable<any>;
    content_editLink: String;
    content_postsTag: Observable<any>;

    posts: Observable<any>;

    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        //, private _drupalPostListComponent: DrupalPostListComponent
        this.settings = _appService.getSettings();
        this.categories = _appService.getCategories();
        this.tags = _appService.getTags();
    }

    ngOnInit() {
        this.route.url.subscribe((params) => {

            this.slimLoadingBarService.start();

            var requestPath = this.settings['cmsAddress']+params.join('/');

            // Handle tags meta-page
            if (params[0] && params[0].path == 'tags') {
                if (!params[1]) {
                    this.router.navigate(['/']);
                } else {
                    requestPath = this.settings['cmsAddress']+params[0].path;
                }
            }

            // console.log("Asking Drupal for page at /"+params.join('/'));
            this._drupalService.request(requestPath).subscribe(result => {

                this.content_status = (result.status[0]) ? result.status[0].value : 0;
                if (this.content_status) {
                    this.content = (result) ? result : {};

                    this.content_nid = (result.nid[0]) ? result.nid[0].value : '';
                    this.content_type = (result.type[0]) ? result.type[0].target_id : 'page';
                    this.content_revision_timestamp = (result.revision_timestamp[0]) ? result.revision_timestamp[0].value : '';

                    this.content_title = (result.title[0]) ? result.title[0].value : '';
                    this.content_subheading = (result.field_subheading && result.field_subheading[0]) ? result.field_subheading[0].value : '';
                    this.content_body = (result.body[0]) ? result.body[0].value : '';
                    this.content_body_format = (result.body[0]) ? result.body[0].format : '';

                    this.content_category = (result.field_category[0]) ? this.categories[result.field_category[0].target_id] : '';
                    this.content_subcategory = (result.field_subcategory[0]) ? this.categories[result.field_subcategory[0].target_id] : '';

                    this.content_editLink = (result.nid[0]) ? this.settings['cmsAddress']+'node/'+result.nid[0].value+'/edit' : '';

                    // if (params[0] && params[0].path != 'tags') {
                    //     // Set term ID for related posts tagged
                    //     this.content_postsTag = (result.field_posts_by_tag && result.field_posts_by_tag[0]) ? result.field_posts_by_tag[0].target_id : '';
                    //     // this._drupalPostListComponent.getPosts(this.content_postsTag);
                    // }

                    this.error = false;
                }
                this.slimLoadingBarService.complete();
            },
            err => {
                this.error = true;
                this.error_message = err;
                this.slimLoadingBarService.complete();
            });
        });
    }
}
