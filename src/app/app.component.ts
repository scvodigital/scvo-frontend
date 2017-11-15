import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchBoxDirective } from './directives/search-box.directive';
import { RouterService } from './services/router.service';
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

    constructor(private router: RouterService){
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

        var html = (<any>window).startingPoint; 
        this.html = this.router.cleanHtml(html, this.router.currentRoute.params, this.router.currentRoute.multipleResults);

        setTimeout(() => {
            this.componentSetup();
        }, 100);
    }

    ngOnInit() {}

    componentSetup(){
        mdc.autoInit();
    }
}
