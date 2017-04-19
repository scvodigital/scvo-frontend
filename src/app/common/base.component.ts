// Experimental base component class to allow for an ngOnConfigLoaded event in all child components
import { Inject, Component } from '@angular/core';

import { Subscription } from 'rxjs/Rx';

import { AppService } from '../services/app.service';

@Component({
    template: ''
})
export class SiteComponent {
    private sub: Subscription = null;

    protected get af(){
        return this.appService.af;
    }

    protected get es(){
        return this.appService.es;
    }

    constructor(@Inject(AppService) protected appService: AppService) {
        var that = this;
        if (this.appService.ready) {
             setTimeout(() => {
                this.onSiteLoaded();
            }, 0);
        } else {
            this.sub = this.appService.readySub.subscribe(() => {
                that.onSiteLoaded();
            });
        }
    }

    onSiteLoaded() {}

    ngOnDestroy() {
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
    }
}
