import { provideRouter, RouterConfig } from '@angular/router';

// Static components
import { HomeComponent } from './components/static/home.component';
// import { HelpComponent } from './components/static/help.component';
// import { PolicyComponent } from './components/static/policy.component';
// import { MediaCentreComponent } from './components/static/media-centre.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';

// Dynamic components
import { SiteSearchComponent } from './components/dynamic/search/site/elastic-results.component';
import { DrupalPageComponent } from './components/dynamic/cms/drupal-page.component';
import { DrupalPostComponent } from './components/dynamic/cms/drupal-post.component';
import { DrupalIndexComponent } from './components/dynamic/cms/drupal-index.component';
import { EventSearchComponent } from './components/dynamic/search/events/elastic-results.component';
import { EventResultComponent } from './components/dynamic/search/events/elastic-result-detail.component';

export const routes: RouterConfig = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SiteSearchComponent },
    // { path: 'media', component: MediaCentreComponent },
    { path: 'about-us', component: DrupalIndexComponent },
    { path: 'about-us/:path', component: DrupalPageComponent },
    { path: 'privacy-and-cookies', component: PrivacyAndCookiesComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'running-your-organisation/:path', component: DrupalIndexComponent },
    { path: 'running-your-organisation/finance/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/business-management/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/governance/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/funding/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/legislation-regulation/:path', component: DrupalPageComponent },
    { path: 'employability/:path', component: DrupalIndexComponent },
    { path: 'employability/community-jobs-scotland/:path', component: DrupalPageComponent },
    { path: 'employability/internships/:path', component: DrupalPageComponent },
    { path: 'employability/past-employability-schemes/:path', component: DrupalPageComponent },
    { path: 'services/:path', component: DrupalPageComponent },
    { path: 'events/:path', component: DrupalPageComponent },
    { path: 'training/search', component: EventSearchComponent },
    { path: 'training/:id', component: EventResultComponent },
    { path: 'policy/:path', component: DrupalIndexComponent },
    { path: 'policy/blogs/:path', component: DrupalPostComponent },
    { path: 'policy/consultation-responses/:path', component: DrupalPostComponent },
    { path: 'policy/briefings-reports/:path', component: DrupalPostComponent },
    { path: 'policy/policy-committee/:path', component: DrupalPostComponent },
    { path: ':path', component: DrupalPageComponent },
    { path: '**', component: HomeComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
