import { Component } from '@angular/core';

import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'footer',
    templateUrl: 'app/components/shared/footer/footer.component.html',
    styles: [require('app/components/shared/footer/footer.component.scss').toString()],
    directives: [ROUTER_DIRECTIVES]
})
export class FooterComponent {
    date = new Date();

    constructor() {}

    ngOnInit() {}

}
