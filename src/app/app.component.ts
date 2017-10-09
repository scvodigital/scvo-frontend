import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'scvo-site',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    modules = [RouterModule];
    html: string = '';

    @ViewChild('appComponent') public viewChild: ElementRef;
    get element(): HTMLElement {
        return this.viewChild.nativeElement.nextElementSibling;
    }
    
    constructor(){
        this.html = (<any>window).startingPoint
            .replace(/(href=\"|\')(\/.*?)(\"|\')/gi, '[routerLink]="[\'$2\']"')
            .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '')
    }
}
