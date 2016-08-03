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
import { DrupalSingleComponent } from './components/dynamic/cms/drupal-single.component';
import { DrupalIndexComponent } from './components/dynamic/cms/drupal-index.component';
import { EventSearchComponent } from './components/dynamic/search/events/elastic-results.component';
import { EventResultComponent } from './components/dynamic/search/events/elastic-result-detail.component';

export const routes: RouterConfig = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SiteSearchComponent },
    // { path: 'media', component: MediaCentreComponent },
    { path: 'about-us', component: DrupalIndexComponent },
    { path: 'privacy-and-cookies', component: PrivacyAndCookiesComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'running-your-organisation/:path', component: DrupalIndexComponent },
    { path: 'running-your-organisation/finance/:path', component: DrupalSingleComponent },
    { path: 'running-your-organisation/business-management/:path', component: DrupalSingleComponent },
    { path: 'running-your-organisation/governance/:path', component: DrupalSingleComponent },
    { path: 'running-your-organisation/funding/:path', component: DrupalSingleComponent },
    { path: 'running-your-organisation/legislation-regulation/:path', component: DrupalSingleComponent },
    { path: 'employability/:path', component: DrupalIndexComponent },
    { path: 'employability/community-jobs-scotland/:path', component: DrupalSingleComponent },
    { path: 'employability/internships/:path', component: DrupalSingleComponent },
    { path: 'employability/past-employability-schemes/:path', component: DrupalSingleComponent },
    { path: 'services/:path', component: DrupalSingleComponent },
    { path: 'events/:path', component: DrupalSingleComponent },
    { path: 'training/search', component: EventSearchComponent },
    { path: 'training/:id', component: EventResultComponent },
    { path: 'policy-hub/:path', component: DrupalIndexComponent },
    { path: 'policy-hub/blogs/:path', component: DrupalSingleComponent },
    { path: 'policy-hub/consultation-responses/:path', component: DrupalSingleComponent },
    { path: 'policy-hub/briefings-and-reports/:path', component: DrupalSingleComponent },
    { path: 'policy-hub/research/:path', component: DrupalSingleComponent },
    { path: 'policy-hub/policy-committee/:path', component: DrupalSingleComponent },
    { path: ':path', component: DrupalSingleComponent },
    { path: '**', component: HomeComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
