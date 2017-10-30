import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Router as ScvoRouter, IRoutes, IContext, RouteMatch } from 'scvo-router';
import { Subscription } from 'rxjs/Rx';

import { RouterService } from '../services/router.service';

@Directive({
    selector: 'form[searchroute]'
})
export class RouterFormDirective {
    @Input('searchroute') searchRoute: string = '';

    constructor(private rd2: Renderer2, private el: ElementRef, private routerService: RouterService, private router: Router) {
        rd2.listen(el.nativeElement, 'submit', (evt: Event) => {
            this.submit(evt);
            return false;
        });
    }

    submit(evt: Event): void {
        console.log('FORM SUBMIT:', evt);
        var params = {};
        [].concat(...(<any>evt.srcElement).elements).forEach((child) => {
            var key = child.name || child.id;
            var val = child.value;

            if(child.type && child.type === 'checkbox'){
                val = child.checked ? child.value : null;
                val = val === 'on' ? true : val === 'off' ? false : val;
            }

            if(val){
                if(params.hasOwnProperty(key)){
                    if(!Array.isArray(params[key])){
                        params[key] = [params[key]];
                    }
                    params[key].push(val);
                }else{
                    params[key] = val;
                }
            }
        });

        var url = this.routerService.scvoRouter.generateUrl(this.searchRoute, { queryParams: params });
        console.log('URL:', url);
        this.router.navigateByUrl(url);
    }
}
