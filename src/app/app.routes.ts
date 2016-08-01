import { provideRouter, RouterConfig } from '@angular/router';

// Static components
import { HomeComponent } from './components/static/home.component';
import { HelpComponent } from './components/static/help.component';
import { PolicyComponent } from './components/static/policy.component';
import { AboutComponent } from './components/static/about.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';

// Dynamic components
import { SiteSearchComponent } from './components/dynamic/search/site/elastic-results.component';
import { DrupalComponent } from './components/dynamic/cms/drupal.component';
import { EventSearchComponent } from './components/dynamic/search/events/elastic-results.component';
import { EventResultComponent } from './components/dynamic/search/events/elastic-result-detail.component';

export const routes: RouterConfig = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SiteSearchComponent },
    { path: 'privacy-and-cookies', component: PrivacyAndCookiesComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'running-your-organisation/:path', component: DrupalComponent },
    { path: 'employability/:path', component: DrupalComponent },
    { path: 'services/:path', component: DrupalComponent },
    { path: 'events-and-training', component: EventSearchComponent },
    { path: 'events-and-training/training-courses', component: EventSearchComponent },
    { path: 'events-and-training/:id', component: EventResultComponent },
    { path: 'policy-hub', component: PolicyComponent },
    { path: 'policy-hub/:path', component: DrupalComponent },
    { path: 'policy-hub/campaigns/:path', component: DrupalComponent },
    { path: ':path', component: DrupalComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
