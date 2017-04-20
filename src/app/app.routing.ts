import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PageComponent } from './components/page/page.component';
import { BlogListComponent } from './components/post/post-list.component';
import { BlogPostComponent } from './components/post/post.component';
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
    { path: 'policy-research/blogs', component: BlogListComponent },
    { path: 'policy-research/blogs/:slug', component: BlogPostComponent },
    { path: '**', component: PageComponent }
];
