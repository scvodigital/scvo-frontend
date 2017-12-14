import { Component, OnInit, ElementRef, Input, Renderer2 } from '@angular/core';

import { Router } from '@angular/router';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch, IMenus, IMenuItem } from 'scvo-router';
import { Subscription } from 'rxjs/Rx';

import { RouterService } from '../../services/router.service';

@Component({
    selector: '[menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    @Input('menu') menuName: string = '';
    @Input('menutemplate') menuTemplate: string = '';

    //get menuItems(): IMenuItem[] {

    //}

    constructor(private rd2: Renderer2, private el: ElementRef, private routerService: RouterService, private router: Router) {
        console.log('Menu Renderer2:', rd2);
        routerService.routeChanged.subscribe((routeMatch: RouteMatch) => {
            this.renderMenu(routeMatch.context.menus);
        });
        this.renderMenu(routerService.currentRoute.context.menus);
    }

    ngOnInit() {
    }

    renderMenu(menus: IMenus) {
        console.log('Render menu', menus);
    }
}
