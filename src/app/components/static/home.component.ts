import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService, SlimLoadingBar } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';

import { DrupalService } from '../../services/drupal.service';
import { AppService } from '../../services/app.service';

import { DrupalPageComponent } from '../dynamic/cms/drupal-page.component';
import { DrupalPostComponent } from '../dynamic/cms/drupal-post.component';

@Component({
    selector: 'home',
    templateUrl: 'app/components/static/home.component.html',
    providers: [DrupalService],
    directives: [ROUTER_DIRECTIVES, SlimLoadingBar, DrupalPageComponent, DrupalPostComponent],
})
export class HomeComponent implements OnInit {
    private settings: Object;

    content_header_image: Observable<any>;

    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private _drupalService: DrupalService, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        this.settings = _appService.getSettings();
    }

    ngOnInit() {
        this.slimLoadingBarService.start();

        this._drupalService.request(this.settings['cmsAddress']+'home').subscribe(result => {

            // console.log(result);

            this.content_header_image = (result.field_header_image[0]) ? result.field_header_image[0].url : '';

            this.error = false;
            this.slimLoadingBarService.complete();
        },
        err => {
            this.error = true;
            this.error_message = err;
            this.slimLoadingBarService.complete();
        });
    }
}
