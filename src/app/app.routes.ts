import { provideRouter, RouterConfig } from '@angular/router';

// Static components
import { HomeComponent } from './components/static/home.component';
import { HelpComponent } from './components/static/help.component';
import { JobsComponent } from './components/static/jobs.component';
import { PolicyComponent } from './components/static/policy.component';
import { SupportComponent } from './components/static/support.component';
import { AboutComponent } from './components/static/about.component';

// Dynamic components
import { SiteSearchComponent } from './components/dynamic/search/site/elastic-results.component';
import { DrupalComponent } from './components/dynamic/cms/drupal.component';
import { EventSearchComponent } from './components/dynamic/search/events/elastic-results.component';
import { EventResultComponent } from './components/dynamic/search/events/elastic-result-detail.component';

export const routes: RouterConfig = [
    { path: '',             component: HomeComponent,        },
    { path: 'help',         component: DrupalComponent,      },
    { path: 'jobs',         component: JobsComponent,        },
    { path: 'policy',       component: PolicyComponent,      },
    { path: 'policy/:path', component: DrupalComponent,      },
    { path: 'news/:path',   component: DrupalComponent,      },
    { path: 'events',       component: EventSearchComponent, },
    { path: 'events/:id',   component: EventResultComponent, },
    { path: 'support',      component: SupportComponent,     },
    { path: 'about',        component: AboutComponent,       },
    { path: 'search',       component: SiteSearchComponent,  },
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
