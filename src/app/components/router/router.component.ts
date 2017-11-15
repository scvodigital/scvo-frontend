import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ContentChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as querystring from 'querystring';
import { Subscription } from 'rxjs/Rx';

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
    path: string = '';
    routerSub: Subscription= null;

    @ViewChild('contentContainer') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }

    constructor(private router: RouterService) {
        this.routerSub = router.routeChanged.subscribe((match: RouteMatch) => {
            this.handleRoute(match);
        });
    }

    ngOnInit() {
        this.handleRoute(this.router.currentRoute);
    }

    handleRoute(match: RouteMatch) {
        window.scrollTo(0, 0);

        console.log(match);

        if (match.jsonLd) {
            var jsonLd = document.querySelector('script[type="application/ld+json"]');
            jsonLd.innerHTML = match.jsonLd;
        }

        if (match.primaryResponse.hits && match.primaryResponse.hits.hits[0]) {
            document.title = match.title;
            var metaTitle = document.querySelector('meta[name="title"]');
            if (metaTitle) {
                metaTitle.setAttribute('content', match.primaryResponse.hits.hits[0]._source.og_title);
            }
            var metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', match.primaryResponse.hits.hits[0]._source.og_summary);
            }
        }

        // Body classes
        var bodyClasses = document.querySelector('body').classList;
        while (bodyClasses.length > 0) {
            bodyClasses.remove(bodyClasses.item(0));
        }
        if (match.params.path) {
            bodyClasses.add(...match.params.path.split('_'));
        } else {
            bodyClasses.add('home');
        }

        // Rendered content
        this.html = this.router.cleanHtml(match.rendered, match.params.query, match.multipleResults);

        setTimeout(() => {
            mdc.autoInit();
        }, 500);
    }
}
