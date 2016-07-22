import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    templateUrl: 'app/components/shared/footer/footer.component.html',
    styles: [require('app/components/shared/footer/footer.component.scss').toString()]
})
export class FooterComponent {
    date = new Date();

    constructor() {}

    ngOnInit() {}

}
