import { Directive, OnInit, ElementRef, Input, Renderer2 } from '@angular/core';

import { Router } from '@angular/router';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch, IMenus, IMenuItem } from 'scvo-router';
import { Subscription } from 'rxjs/Rx';

import { RouterService } from '../services/router.service';

@Directive({
    selector: '[menus]',
})
export class MenuDirective implements OnInit {
    @Input('menu') menuName: string = '';
    templateNode: HTMLElement = null;
    menuHtml: string = '';

    get menuItems(): IMenuItem[] {
        if (this.routerService.currentRoute && this.routerService.currentRoute.context.menus.hasOwnProperty(this.menuName)) {
            return this.routerService.currentRoute.context.menus[this.menuName];
        } else {
            return [];
        }
    }

    constructor(private rd2: Renderer2, private el: ElementRef, private routerService: RouterService, private router: Router) {
    }

    ngOnInit() {
        this.menuHtml = this.el.nativeElement.innerHTML;
        this.templateNode = this.el.nativeElement.children[0].cloneNode();
        this.routerService.routeChanged.subscribe((routeMatch: RouteMatch) => {
            this.renderMenu();
        });
        this.renderMenu();
    }

    renderMenu() {
        console.log(this.menuItems);
        var elementsHtml = '';
        this.menuItems.forEach((menuItem: IMenuItem) => {
            var element = this.templateNode.cloneNode();
            if (element.nodeName === 'A') {
                (<any>element).setAttribute('href', menuItem.path);
            } else {
                (<any>element).querySelector('a').setAttribute('href', menuItem.path);
            }
            if ((<any>element).children.length === 0) {
                (<any>element).innerHTML = menuItem.label;
            }
            elementsHtml += (<any>element).outerHTML;
        });
        console.log('elements:', elementsHtml);
        var ngElements = this.routerService.cleanHtml(elementsHtml);
        console.log('ngElements:', ngElements);
        this.el.nativeElement.innerHTML = ngElements;
    }
}
