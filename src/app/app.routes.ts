import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { SearchComponent } from './components/elastic/search.component';

export const routes: RouterConfig = [
    { path: '',        component: HomeComponent,        },
    { path: 'help',    component: HomeComponent,        },
    { path: 'jobs',    component: HomeComponent,        },
    { path: 'policy',  component: HomeComponent,        },
    { path: 'support', component: HomeComponent,        },
    { path: 'about',   component: AboutComponent,       },
    { path: 'search',  component: SearchComponent,      },
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
