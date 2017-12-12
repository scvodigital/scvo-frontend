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
        console.log('Router Component Init');
        this.handleRoute(this.router.currentRoute);
    }

    handleRoute(match: RouteMatch) {
        console.log('Handle Route:', match.name);
        window.scrollTo(0, 0);

        console.log(match);

        var headTags = Array.prototype.slice.call(document.querySelectorAll('[data-dynamic="true"],title'));
        headTags.forEach((el) => {
            el.parentElement.removeChild(el);
        });

        var tempHead = document.createElement('head');
        var headTag = document.querySelector('head');
        tempHead.innerHTML = match.headTags;

        while (tempHead.hasChildNodes()) {
            headTag.appendChild(tempHead.removeChild(tempHead.firstChild));
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
