import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PageComponent } from './components/page/page.component';
import { ServicesPageComponent } from './components/services/services-page.component';
import { CampaignsPageComponent } from './components/campaigns/campaigns-page.component';
import { BlogListComponent } from './components/post/post-list.component';
import { BlogPostComponent } from './components/post/post.component';
import { BriefingListComponent } from './components/post/briefing-list.component';
import { BriefingPostComponent } from './components/post/briefing.component';
import { ResearchListComponent } from './components/post/research-list.component';
import { ResearchPostComponent } from './components/post/research.component';
import { LoanCalculatorComponent } from './components/credit-union/loan-calculator.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';

import { AdminComponent } from './components/admin/admin.component';
import { MenuListComponent } from './components/admin/menu-list/menu-list.component';
import { MenuEditorComponent } from './components/admin/menu-editor/menu-editor.component';
import { PageListComponent } from './components/admin/page-list/page-list.component';
import { PageEditorComponent } from './components/admin/page-editor/page-editor.component';
import { TranslationsManagerComponent } from './components/admin/translations-manager/translations-manager.component';

export const rootRouterConfig: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    // { path: 'search', component: SiteSearchComponent },
    // { path: ':path', component: SiteSearchComponent },
    { path: 'privacy-and-cookies', component: PrivacyAndCookiesComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'services', component: ServicesPageComponent },
    { path: 'services/credit-union/loan-calculator', component: LoanCalculatorComponent },
    { path: 'projects-campaigns', component: CampaignsPageComponent },
    { path: 'policy-research/blogs', component: BlogListComponent },
    { path: 'policy-research/blogs/:slug', component: BlogPostComponent },
    { path: 'policy-research/briefings-consultation-responses', component: BriefingListComponent },
    { path: 'policy-research/briefings-consultation-responses/:slug', component: BriefingPostComponent },
    { path: 'policy-research/research', component: ResearchListComponent },
    { path: 'policy-research/research/:slug', component: ResearchPostComponent },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: 'menu-editor', component: MenuListComponent },
            { path: 'menu-editor/:id', component: MenuEditorComponent },
            { path: 'page-editor', component: PageListComponent },
            { path: 'page-editor/:id', component: PageEditorComponent },
            { path: 'translations', component: TranslationsManagerComponent },
        ]
    },
    { path: '**', component: PageComponent }
];
