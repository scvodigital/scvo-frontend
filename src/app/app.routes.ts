import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './components/static/home.component';
import { HelpComponent } from './components/static/help.component';
import { JobsComponent } from './components/static/jobs.component';
import { PolicyComponent } from './components/static/policy.component';
import { EventSearchComponent } from './components/dynamic/search/events/search-form.component';
import { EventResultComponent } from './components/dynamic/search/events/result.component';
import { SupportComponent } from './components/static/support.component';
import { AboutComponent } from './components/static/about.component';
import { SearchComponent } from './components/dynamic/search/site/elastic.component';

export const routes: RouterConfig = [
    { path: '',             component: HomeComponent,        },
    { path: 'help',         component: HelpComponent,        },
    { path: 'jobs',         component: JobsComponent,        },
    { path: 'policy',       component: PolicyComponent,      },
    { path: 'events',       component: EventSearchComponent, },
    { path: 'events/:id',   component: EventResultComponent, },
    { path: 'support',      component: SupportComponent,     },
    { path: 'about',        component: AboutComponent,       },
    { path: 'search',       component: SearchComponent,      },
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
