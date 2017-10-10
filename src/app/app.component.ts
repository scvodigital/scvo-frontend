import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchBoxDirective } from './directives/search-box.directive';
import { AppModule } from './app.module';

declare var mdc: any;

@Component({
  selector: 'scvo-site',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    modules = [RouterModule];
    html: string = '';

    @ViewChild('appComponent') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }
    
    constructor(){
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
