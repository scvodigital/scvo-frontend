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
    { path: '',                                 component: HomeComponent,        },
    { path: 'running-your-organisation',        component: DrupalComponent,      },
    { path: 'running-your-organisation/:path',  component: DrupalComponent,      },
    { path: 'employability',                    component: JobsComponent,        },
    { path: 'employability/:path',              component: DrupalComponent,      },
    { path: 'products-and-services',            component: DrupalComponent,      },
    { path: 'products-and-services/:path',      component: DrupalComponent,      },
    { path: 'events-and-training',              component: EventSearchComponent, },
    { path: 'events-and-training/:id',          component: EventResultComponent, },
    { path: 'policy-hub',                       component: PolicyComponent,      },
    { path: 'policy-hub/:path',                 component: DrupalComponent,      },
    { path: 'support',                          component: SupportComponent,     },
    { path: 'about',                            component: AboutComponent,       },
    { path: 'search',                           component: SiteSearchComponent,  },
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
