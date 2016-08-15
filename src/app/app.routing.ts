import { RouterModule, Routes } from '@angular/router';

// Static components
import { HomeComponent } from './components/static/home.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';

// Dynamic components
import { SiteSearchComponent } from './components/dynamic/search/site/elastic-results.component';
import { DrupalRedirectComponent } from './components/dynamic/cms/drupal-redirect.component';
import { DrupalPageComponent } from './components/dynamic/cms/drupal-page.component';
import { DrupalPostComponent } from './components/dynamic/cms/drupal-post.component';
import { DrupalIndexComponent } from './components/dynamic/cms/drupal-index.component';
import { DrupalMediaCentreComponent } from './components/dynamic/cms/drupal-media-centre.component';
import { CJSSearchComponent } from './components/dynamic/search/cjs/elastic-results.component';
import { GoodmovesSearchComponent } from './components/dynamic/search/goodmoves/elastic-results.component';
import { TrainingSearchComponent } from './components/dynamic/search/training/elastic-results.component';
import { TrainingResultComponent } from './components/dynamic/search/training/elastic-result-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SiteSearchComponent },
    // { path: 'media', component: MediaCentreComponent },
    { path: 'tags/:path', component: DrupalPageComponent },
    { path: 'about-us', component: DrupalIndexComponent },
    { path: 'about-us/:path', component: DrupalPageComponent },
    { path: 'media-centre', component: DrupalMediaCentreComponent },
    { path: 'privacy-and-cookies', component: PrivacyAndCookiesComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'running-your-organisation/:path', component: DrupalIndexComponent },
    { path: 'running-your-organisation/finance/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/business-management/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/governance/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/funding/:path', component: DrupalPageComponent },
    { path: 'running-your-organisation/legislation-regulation/:path', component: DrupalPageComponent },
    { path: 'employability/:path', component: DrupalIndexComponent },
    { path: 'employability/community-jobs-scotland/latest-cjs-opportunities', component: CJSSearchComponent },
    { path: 'employability/community-jobs-scotland/:path', component: DrupalPageComponent },
    { path: 'employability/internships/:path', component: DrupalPageComponent },
    { path: 'employability/past-employability-schemes/:path', component: DrupalPageComponent },
    { path: 'services/goodmoves', component: GoodmovesSearchComponent },
    { path: 'services/:path', component: DrupalPageComponent },
    { path: 'events/:path', component: DrupalPageComponent },
    { path: 'training/search', component: TrainingSearchComponent },
    { path: 'training/:id', component: TrainingResultComponent },
    { path: 'policy/:path', component: DrupalIndexComponent },
    { path: 'policy/blogs/:path', component: DrupalPostComponent },
    { path: 'policy/consultation-responses/:path', component: DrupalPostComponent },
    { path: 'policy/briefings-reports/:path', component: DrupalPostComponent },
    { path: 'policy/policy-committee/:path', component: DrupalPostComponent },
    { path: 'node/:path', component: DrupalRedirectComponent },
    { path: ':path', component: DrupalPageComponent },
    { path: '**', component: HomeComponent }
];

export const routing = RouterModule.forRoot(routes);
