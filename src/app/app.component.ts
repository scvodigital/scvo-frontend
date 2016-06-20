import { Component, ViewEncapsulation } from '@angular/core';
import { Routes, ROUTER_DIRECTIVES } from '@angular/router';

import { MaterializeDirective } from "angular2-materialize";

import { Client } from "elasticsearch";

import { Header, Footer } from './components/shared/shared';

import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Search } from './components/elastic/search';

@Component({
    selector: 'scvo-app',
    providers: [],
    pipes: [],
    directives: [ROUTER_DIRECTIVES, Header, Footer, MaterializeDirective],
    templateUrl: 'app/app.component.html',
    styleUrls: [require('app/styles/scvo.scss')],
    encapsulation: ViewEncapsulation.None,
})
@Routes([
    { path: '/',        component: Home,        },
    { path: '/help',    component: Home,        },
    { path: '/jobs',    component: Home,        },
    { path: '/policy',  component: Home,        },
    { path: '/support', component: Home,        },
    { path: '/about',   component: About,       },
    { path: '/search', component: Search,     },
])
export class App {
    constructor() {}
}
