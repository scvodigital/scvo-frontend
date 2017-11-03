import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchBoxDirective } from './directives/search-box.directive';
import { LazyModule } from './lazy.module';

declare var mdc: any;

@Component({
  selector: 'scvo-site',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    modules = [RouterModule, LazyModule];
    html: string = '';

    @ViewChild('appComponent') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }

    constructor(){
        window.addEventListener("message", (event) => {
            if (event.data.hasOwnProperty('event')) {
                /*
                 * EMBED THIS SCRIPT IN THE HTML OF THE SURVEY
                <script>
                    document.addEventListener("DOMContentLoaded", function() {
                        var height = document.body.scrollHeight;
                        parent.postMessage({ event: 'resize', height: height }, '*');
                    })
                </script>
                 * THIS NEED TESTING
                 */
                console.log('Post Message Event', event.data);
                switch (event.data.event) {
                    case ('resize'):
                        (<HTMLIFrameElement>document.querySelector('iframe[src*="' + event.origin + '"]')).style.height = event.data.height + 'px';
                        break;
                }
            }
        }, false);

        this.html = (<any>window).startingPoint
            .replace(/(href=\"|\')(\/.*?)(\"|\')/gi, '[routerLink]="[\'$2\']"')
            .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '');

        setTimeout(() => {
            this.componentSetup();
        }, 100);
    }

    ngOnInit() {}

    componentSetup(){
        mdc.autoInit();
    }
}
