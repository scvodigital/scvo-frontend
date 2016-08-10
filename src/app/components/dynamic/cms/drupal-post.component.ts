import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { AppService } from '../../../services/app.service';
import { DrupalService } from '../../../services/drupal.service';

import { MapToIterablePipe } from '../../../pipes/map-to-iterable.pipe';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';

@Component({
    selector: 'cms-post',
    templateUrl: 'app/components/dynamic/cms/drupal-post.component.html',
    providers: [AppService, DrupalService],
    directives: [ROUTER_DIRECTIVES, SlimLoadingBar],
    pipes: [MapToIterablePipe, MarkdownPipe]
})
export class DrupalPostComponent implements OnInit {
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
    content_tags: Object;

    error: Boolean = false;
    error_message: Observable<any>;

    public cmsCategories: Object;
    public cmsTags: Object;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        this.cmsCategories = _appService.cmsCategories;
        this.cmsTags = _appService.cmsTags;
    }

    ngOnInit() {
        this.route.url.subscribe((params) => {

            this.slimLoadingBarService.start();

            // console.log("Asking Drupal for post at /"+params.join('/'));

            this._drupalService.request(params.join('/')).subscribe(result => {

                this.content_status = (result.status[0]) ? result.status[0].value : 0;
                if (this.content_status) {
                    this.content = (result) ? result : {};

                    this.content_nid = (result.nid[0]) ? result.nid[0].value : '';
                    this.content_type = (result.type[0]) ? result.type[0].target_id : 'post';
                    this.content_revision_timestamp = (result.revision_timestamp[0]) ? result.revision_timestamp[0].value : '';

                    this.content_title = (result.title[0]) ? result.title[0].value : '';
                    this.content_subheading = (result.field_subheading && result.field_subheading[0]) ? result.field_subheading[0].value : '';
                    this.content_body = (result.body[0]) ? result.body[0].value : '';
                    this.content_body_format = (result.body[0]) ? result.body[0].format : '';

                    this.content_category = (result.field_category[0]) ? this.cmsCategories[result.field_category[0].target_id] : '';
                    this.content_subcategory = (result.field_subcategory[0]) ? this.cmsCategories[result.field_subcategory[0].target_id] : '';

                    if (result.field_tags && result.field_tags[0]) {
                        this.content_tags = {};
                        for (var tag in result.field_tags) {
                            this.content_tags[result.field_tags[tag].target_id] = this.cmsTags[result.field_tags[tag].target_id];
                        }
                    }

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
