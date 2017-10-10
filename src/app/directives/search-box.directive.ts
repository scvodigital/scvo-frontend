import { Directive, Renderer2, ElementRef, Input } from '@angular/core';

@Directive({
    selector: 'input[searchroute]'
})
export class SearchBoxDirective {
    @Input('searchroute') searchRoute: string = '';
    @Input('paramstemplate') paramsTemplate: string = '';

    constructor(private rd2: Renderer2, private el: ElementRef) {
        console.log('RENDERER2:', rd2);
        console.log('ELEMENTREF:', el);
    }

}
