import { Component, NgZone } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { DrupalService } from '../../../services/drupal.service';
import { AppService } from '../../../services/app.service';

@Component({
    selector: 'cms-post-list',
    templateUrl: 'app/components/dynamic/cms/drupal-post-list.component.html',
    providers: [DrupalService],
    directives: [ROUTER_DIRECTIVES, SlimLoadingBar]
})
export class DrupalPostListComponent {
    zone: NgZone;

    private settings: Object;

    posts: Observable<any>;

    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private route: ActivatedRoute, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        this.settings = _appService.getSettings();

        this.zone = new NgZone({enableLongStackTrace: false});

        // Handle tags meta-page
        this.route.url.subscribe((params) => {
            if (params[0] && params[0].path == 'tags') {
                if (params[1]) {
                    this._drupalService.request(this.settings['cmsAddress']+'tid-by-name/'+params[1].path).subscribe(term => {
                        if (term[0]) {
                                this.getPosts(term[0].tid);
                        }
                    });
                }
            }
        });
    }

    getPosts(postsTag) {
        this.slimLoadingBarService.start();
        if (postsTag != 0) {
            this._drupalService.request(this.settings['cmsAddress']+'posts/'+postsTag).subscribe(posts => {
                this.zone.run(() => {
                    this.posts = posts;
                    console.log(this.posts);
                });
            },
            err => {
                this.error = true;
                this.error_message = err;
            });
        }
        this.slimLoadingBarService.complete();
    }
}
