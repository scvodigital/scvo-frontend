import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { DrupalService } from '../../../services/drupal.service';

// import { StringToDate } from '../../../pipes/string-to-date.pipe';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';

import { DrupalSingleComponent } from './drupal-single.component';

@Component({
    selector: 'cms-index',
    templateUrl: 'app/components/dynamic/cms/drupal-index.component.html',
    directives: [ROUTER_DIRECTIVES, DrupalSingleComponent],
    providers: [DrupalService],
    pipes: [MarkdownPipe]
})
export class DrupalIndexComponent implements OnInit {
    loading: Boolean = true;
    content_status: Observable<any>;
    content_nid: Observable<any>;
    content_type: Observable<any>;
    content_revision_timestamp: Observable<any>;
    content_title: Observable<any>;
    content_subheading: Observable<any>;
    content_body: Observable<any>;
    content_body_format: Observable<any>;
    content: Observable<any>;
    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService) {}

    ngOnInit() {
        this.route.url.subscribe((params) => {
            this.loading = true;
            // console.log("Asking Drupal for /"+params.join('/'));
            this._drupalService.loadPage(params.join('/')).subscribe(result => {
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
                    this.loading = false;
                    this.error = false;
                }
            },
            err => {
                this.error = true;
                this.error_message = err;
                this.loading = false;
            });
        });
    }
}
