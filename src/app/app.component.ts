import { Component, ViewEncapsulation } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

import { HeaderComponent, FooterComponent } from './components/shared/shared';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { SearchComponent } from './components/elastic/search.component';

@Component({
    selector: 'scvo-app',
    providers: [],
    pipes: [],
    directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent, MaterializeDirective],
    templateUrl: 'app/app.component.html',
    styleUrls: [require('app/styles/scvo.scss')],
    encapsulation: ViewEncapsulation.None,
})
@Routes([
    { path: '/',        component: HomeComponent,        },
    { path: '/help',    component: HomeComponent,        },
    { path: '/jobs',    component: HomeComponent,        },
    { path: '/policy',  component: HomeComponent,        },
    { path: '/support', component: HomeComponent,        },
    { path: '/about',   component: AboutComponent,       },
    { path: '/search',  component: SearchComponent,      },
])
export class App {
    // term: string;

    constructor() {}
}
