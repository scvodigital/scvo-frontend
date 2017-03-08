import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from '../../../services/app.service';
import { DrupalService } from '../../../services/drupal.service';

@Component({
    selector: 'cms-redirect',
    template: '<strong>Loading...</strong>',
    providers: [DrupalService],
})
export class DrupalRedirectComponent {
    private settings: Object;

    constructor(private router: Router, private route: ActivatedRoute, private _appService: AppService, private _drupalService: DrupalService) {
        this.settings = _appService.getSettings();

        this.route.url.subscribe((params) => {
            if (params[1] && params[1].path) {
                this._drupalService.request(this.settings['cmsAddress']+'path/'+params[1].path).subscribe(result => {
                    if (result[0] && result[0].path) {
                        this.router.navigate([result[0].path]);
                    }
                });
            }
        });
    }
}
