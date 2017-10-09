import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var mdc: any;

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
            .replace(/(\<\/?big\>)|(\<\/?small\>)/g, '');
        setTimeout(() => {
            this.componentSetup();
        }, 100);
    }

    componentSetup(){
        mdc.autoInit();

        var searchBoxes = document.querySelectorAll('input[data-search-url]');
        [].forEach.call(searchBoxes, (searchBox: HTMLInputElement) => {
            console.log('Found search input', searchBox);
            var searchUrlBase = searchBox.getAttribute('data-search-url');
            console.log('Search Url Base:', searchUrlBase);
            searchBox.addEventListener('keyup', (event) => {
                console.log('Search box event', event);
                if(event.keyCode === 13){
                    var searchQuery = searchBox.value;
                    console.log('KeyCode 13!', searchQuery);
                    var searchUrl = searchUrlBase.replace(/\%q/g, searchQuery);
                    console.log('Navigating to url:', searchUrl);
                    window.location.href = searchUrl;
                }
            });
        });
    }
}
