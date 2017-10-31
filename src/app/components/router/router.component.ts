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
        console.log('RouterComponent.constructor()');
        this.routerSub = router.routeChanged.subscribe((match: RouteMatch) => {
            console.log('RouterComponent.constructor().routeChanged()');
            this.handleRoute(match);
        });
    }

    ngOnInit() {
        console.log('RouterComponent.ngOnInit()');
        this.handleRoute(this.router.currentRoute);
    }

    handleRoute(match: RouteMatch) {
        console.log('RouterComponent.handleRoute()');
        window.scrollTo(0, 0);

        console.log(match);

        if (match.jsonLd) {
            var jsonLd = document.querySelector('script[type="application/ld+json"]');
            jsonLd.innerHTML = match.jsonLd;
        }

        if (match.primaryResponse.hits && match.primaryResponse.hits.hits[0]) {
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

        console.log('Multiple results:', match.multipleResults);

        // Rendered content
        this.html = match.rendered
            .replace(this.router.domainStripper, '')
            .replace(/(href=\"|\')(\/.*?)(\"|\')/gi, (m, p1, p2, p3) => {
                var parts = p2.split('?');
                var url = parts[0];
                var replaceString = `[routerLink]="'${url}'"`;

                var query = parts.length > 1 ? querystring.parse(parts[1]) : {};
                if (match.multipleResults) {
                    console.log('Multiple results before, query:', query, '| params:', match.params); 
                    var combined = {};
                    Object.assign(combined, match.params.query, query);
                    query = combined;
                    console.log('Multiple results after, query:', query); 
                }
                if (Object.keys(query).length > 0) {
                    var queryJson = JSON.stringify(query);
                    replaceString += ` [queryParams]='${queryJson}'`;
                }

                return replaceString;
            })
            .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '');

        setTimeout(() => {
            mdc.autoInit();
        }, 500);
    }
}
