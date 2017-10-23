import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ContentChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LazyModule } from '../../lazy.module';
import { RouteMatch } from 'scvo-router';
import { RouterService } from '../../services/router.service';

declare var mdc: any;

@Component({
    selector: 'app-router',
    templateUrl: './router.component.html'
})
export class RouterComponent implements OnInit {
    modules = [RouterModule, LazyModule];
    html: string = '';

    @ViewChild('contentContainer') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }

    constructor(private router: RouterService) {
        router.routeChanged.subscribe((match: RouteMatch) => {
            console.log(match);
            this.html = match.rendered
                .replace(this.router.domainStripper, '')
                .replace(/(href=\"|\')(\/.*?)(\"|\')/gi, '[routerLink]="[\'$2\']"')
                .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '');
            mdc.autoInit();
        });
    }

    ngOnInit() {}
}
