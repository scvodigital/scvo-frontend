import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MetaService } from '@nglibs/meta';

import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'privacy',
    templateUrl: './terms-and-conditions.component.html',
    providers: [TranslatePipe]
})
export class TermsAndConditionsComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private translatePipe: TranslatePipe,
        private readonly meta: MetaService
    ) {}

    ngOnInit() {
        this.route.url.subscribe(url => {
            // Set title
            var slug_full = this.router.url.substr(1);
            var slug_page = slug_full.substr(slug_full.lastIndexOf('/') + 1);
            this.meta.setTitle(this.translatePipe.transform('title:-'+slug_page, 'en'));
        });
    }
}
