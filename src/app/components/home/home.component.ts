import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { MetaService } from '@nglibs/meta';
// import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { AppService } from '../../services/app.service';

import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers: [TranslatePipe]
})
export class HomeComponent implements OnInit {
    private settings: Object;

    content_header_image: Observable<any>;

    error: Boolean = false;
    error_message: Observable<any>;

    constructor(
        // private slimLoadingBarService: SlimLoadingBarService,
        private _appService: AppService,
        private route: ActivatedRoute,
        private router: Router,
        private translatePipe: TranslatePipe,
        private readonly meta: MetaService
    ) {}

    ngOnInit() {
        this.meta.setTitle('Scottish Council for Voluntary Organisations');
    }
}
