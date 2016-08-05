import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { MarkdownPipe } from '../../../pipes/markdown.pipe';
import { DrupalService } from '../../../services/drupal.service';

@Component({
    selector: 'cms-single',
    templateUrl: 'app/components/dynamic/cms/drupal-single.component.html',
    directives: [ROUTER_DIRECTIVES, SlimLoadingBar],
    providers: [DrupalService],
    pipes: [MarkdownPipe]
})
export class DrupalSingleComponent implements OnInit {
    content_status: Observable<any>;
    content_nid: Observable<any>;
    content_type: Observable<any>;
    content_revision_timestamp: Observable<any>;
    content_title: Observable<any>;
    content_subheading: Observable<any>;
    content_body: Observable<any>;
    content_body_format: Observable<any>;
    content: Observable<any>;
    parent_path: String;
    parent_title: String;
    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService) {}

    ngOnInit() {
        this.route.url.subscribe((params) => {

            this.slimLoadingBarService.start();

            // console.log("Asking Drupal for page at /"+params.join('/'));

            this._drupalService.request(params.join('/')).subscribe(result => {
                // if (params[1]) {
                //     this.parent_path = (params[1]) ? params[0].path+'/'+params[1].path : '';
                //     console.log(this.parent_path);
                //     console.log(params.join('/'));
                //     if (this.parent_path != params.join('/')) {
                //         console.log('Setting link');
                //         this.parent_title = params[1].path.replace('-', ' ').toLowerCase();
                //         this.parent_path = '/'+this.parent_path;
                //     }
                // }

                this.content_status =                   (result.status[0]) ?                result.status[0].value : 0;
                if (this.content_status) {
                    this.content_nid =                  (result.nid[0]) ?                   result.nid[0].value : '';
                    this.content_type =                 (result.type[0]) ?                  result.type[0].target_id : 'page';
                    this.content_revision_timestamp =   (result.revision_timestamp[0]) ?    result.revision_timestamp[0].value : '';
                    this.content_title =                (result.title[0]) ?                 result.title[0].value : '';
                    this.content_subheading =           (result.field_subheading[0]) ?      result.field_subheading[0].value : '';
                    this.content_body =                 (result.body[0]) ?                  result.body[0].value : '';
                    this.content_body_format =          (result.body[0]) ?                  result.body[0].format : '';
                    this.content =                      (result) ?                          result : {};

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
