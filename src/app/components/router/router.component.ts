import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ContentChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as querystring from 'querystring';

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

    @ViewChild('contentContainer') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }

    constructor(private router: RouterService) {
        router.routeChanged.subscribe((match: RouteMatch) => {
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

            // Rendered content
            this.html = match.rendered
                .replace(this.router.domainStripper, '')
                .replace(/(href=\"|\')(\/.*?)(\"|\')/gi, (match, p1, p2, p3) => {
                    var parts = p2.split('?');
                    var url = parts[0];
                    var replaceString = `[routerLink]="'${url}'"`;

                    var query = {};
                    if(parts.length > 1){
                        query = querystring.parse(parts[1]);
                        var queryJson = JSON.stringify(query);
                        replaceString += ` [queryParams]='${queryJson}'`;
                    }

                    return replaceString;
                })
                .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '');

            setTimeout(() => {
                mdc.autoInit();
            }, 500);
        });
    }

    ngOnInit() {}
}
