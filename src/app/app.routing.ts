import { Routes } from '@angular/router';

// Static components
import { HomeComponent } from './components/static/home.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';

// Dynamic components
import { SiteSearchComponent } from './components/dynamic/search/site/elastic-results.component';
import { CJSSearchComponent } from './components/dynamic/search/cjs/elastic-results.component';
import { GoodmovesSearchComponent } from './components/dynamic/search/goodmoves/elastic-results.component';
import { TrainingSearchComponent } from './components/dynamic/search/training/elastic-results.component';
import { TrainingResultComponent } from './components/dynamic/search/training/elastic-result-detail.component';

export const rootRouterConfig: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'search', component: SiteSearchComponent },
    // { path: 'media', component: MediaCentreComponent },
    { path: 'tags/:path', component: SiteSearchComponent },
    { path: 'about-us', component: SiteSearchComponent },
    { path: 'about-us/:path', component: SiteSearchComponent },
    { path: 'media-centre', component: SiteSearchComponent },
    { path: 'privacy-and-cookies', component: PrivacyAndCookiesComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'running-your-organisation/:path', component: SiteSearchComponent },
    { path: 'running-your-organisation/finance/:path', component: SiteSearchComponent },
    { path: 'running-your-organisation/managing-your-organisation/:path', component: SiteSearchComponent },
    { path: 'running-your-organisation/governance/:path', component: SiteSearchComponent },
    { path: 'running-your-organisation/funding/:path', component: SiteSearchComponent },
    { path: 'running-your-organisation/legislation-regulation/:path', component: SiteSearchComponent },
    { path: 'employability/:path', component: SiteSearchComponent },
    { path: 'employability/community-jobs-scotland/latest-cjs-opportunities', component: CJSSearchComponent },
    { path: 'employability/community-jobs-scotland/:path', component: SiteSearchComponent },
    { path: 'employability/internships/:path', component: SiteSearchComponent },
    { path: 'employability/past-employability-schemes/:path', component: SiteSearchComponent },
    { path: 'services/goodmoves', component: GoodmovesSearchComponent },
    { path: 'services/:path', component: SiteSearchComponent },
    { path: 'events/:path', component: SiteSearchComponent },
    { path: 'training/search', component: TrainingSearchComponent },
    { path: 'training/:id', component: TrainingResultComponent },
    { path: 'policy/:path', component: SiteSearchComponent },
    { path: 'policy/blogs/:path', component: SiteSearchComponent },
    { path: 'policy/consultation-responses/:path', component: SiteSearchComponent },
    { path: 'policy/briefings-reports/:path', component: SiteSearchComponent },
    { path: 'policy/policy-committee/:path', component: SiteSearchComponent },
    { path: 'node/:path', component: SiteSearchComponent },
    { path: ':path', component: SiteSearchComponent },
    { path: '**', component: HomeComponent }
];
