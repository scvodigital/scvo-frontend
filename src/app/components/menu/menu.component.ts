import { Component, OnInit, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

import { RouterModule, Router } from '@angular/router';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch, IMenus, IMenuItem } from 'scvo-router';
import { Subscription } from 'rxjs/Rx';

import { LazyModule } from '../../lazy.module';
import { RouterService } from '../../services/router.service';

@Component({
    selector: '[menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    @Input('menu') menuName: string = '';
    @Input('menulinkselector') menuLinkSelector: string = '';
    @Input('menulabelselector') menuLabelSelector: string = '';
    @Input('menuactiveclass') menuActiveClass: string = '';
    
    templateNode: HTMLElement = null;
    modules = [RouterModule, LazyModule];
    html: string = '';
    path: string = '';
    
    @ViewChild('menuContainer') public viewChild: ElementRef;
    
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
        this.html = this.viewChild.nativeElement.innerHTML;
        this.templateNode = this.viewChild.nativeElement.children[0].cloneNode(true);
        this.viewChild.nativeElement.innerHTML = '';
        this.routerService.routeChanged.subscribe((routeMatch: RouteMatch) => {
            this.renderMenu();
        });
        this.renderMenu();
    }

    renderMenu() {
        console.log(this.menuItems);
        var elementsHtml = '';
        this.menuItems.forEach((menuItem: IMenuItem) => {
            var element = this.templateNode.cloneNode(true);
            if (!this.menuLinkSelector) {
                (<any>element).setAttribute('href', menuItem.path);
                if (menuItem.match) {
                    (<any>element).classList.add(this.menuActiveClass);
                } else {
                    (<any>element).classList.remove(this.menuActiveClass);
                }
            } else {
                (<any>element).querySelector(this.menuLinkSelector).setAttribute('href', menuItem.path);
                if (menuItem.match) {
                    (<any>element).querySelector('a').classList.add('active');
                } else {
                    (<any>element).querySelector('a').classList.remove('active');
                }
            }
            if (!this.menuLabelSelector) {
                (<any>element).innerHTML = menuItem.label;
            } else {
                (<any>element).querySelector(this.menuLabelSelector).innerHTML = menuItem.label;
            }
            elementsHtml += (<any>element).outerHTML;
        });
        var ngElements = this.routerService.cleanHtml(elementsHtml);
        this.html = ngElements;
    }
}
