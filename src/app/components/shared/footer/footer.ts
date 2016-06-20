import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    templateUrl: 'app/components/shared/footer/footer.html',
    styleUrls: ['app/components/shared/footer/footer.css'],
    providers: [],
    directives: [],
    pipes: []
})
export class Footer {
    date = new Date();

    constructor() {}

    ngOnInit() {}

}
