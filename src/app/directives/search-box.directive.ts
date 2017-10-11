import { Directive, Renderer2, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RouterService } from '../services/router.service';

@Directive({
    selector: 'input[searchroute]'
})
export class SearchBoxDirective {
    @Input('searchroute') searchRoute: string = '';
    @Input('paramstemplate') paramsTemplate: string = '';

    private get inputBox(): HTMLInputElement {
        return this.el.nativeElement;
    }

    private get query(): string {
        return this.inputBox.value;
    }

    constructor(private rd2: Renderer2, private el: ElementRef, private routerService: RouterService, private router: Router) {
        rd2.listen(el.nativeElement, 'keyup', (evt: KeyboardEvent) => {
            this.keyup(evt);       
        });
    }

    keyup(evt: KeyboardEvent): void {
        if(evt.key === 'Enter'){
            var query = JSON.stringify(this.query);
            var paramsJson = this.paramsTemplate.replace(/\%q/g, query);
            var params = JSON.parse(paramsJson);
            var url = this.routerService.scvoRouter.generateUrl(this.searchRoute, params);
            this.router.navigateByUrl(url);
        }
    }
}
