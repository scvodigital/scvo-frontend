import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    templateUrl: 'app/components/shared/footer/footer.component.html',
    styleUrls: [require('app/components/shared/footer/footer.component.scss')]
})
export class FooterComponent {
    date = new Date();

    constructor() {}

    ngOnInit() {}

}
