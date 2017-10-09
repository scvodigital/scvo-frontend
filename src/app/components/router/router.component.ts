import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ContentChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RouteMatch } from 'scvo-router';
import { RouterService } from '../../services/router.service';

declare var componentHandler: any;

@Component({
    selector: 'app-router',
    templateUrl: './router.component.html',
    styleUrls: ['./router.component.css']
})
export class RouterComponent implements OnInit {
    modules = [RouterModule];
    html: string = '';

    @ViewChild('contentContainer') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }
    
    constructor(private router: RouterService) {
        router.routeChanged.subscribe((match: RouteMatch) => {
            console.log(match);
            this.html = match.rendered
                .replace(/(href=\"|\')(\/.*?)(\"|\')/gi, '[routerLink]="[\'$2\']"')
                .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '');
        });  
    }

    ngOnInit() {}
}
