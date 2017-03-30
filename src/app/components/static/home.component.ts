import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { AppService } from '../../services/app.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    private settings: Object;

    content_header_image: Observable<any>;

    error: Boolean = false;
    error_message: Observable<any>;

    constructor(private router: Router, private slimLoadingBarService: SlimLoadingBarService, private _appService: AppService) {
        this.settings = _appService.getSettings();
    }

    ngOnInit() {
        // this.slimLoadingBarService.start();
    }
}
