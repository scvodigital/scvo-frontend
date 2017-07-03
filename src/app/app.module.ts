/* Routes */
import { rootRouterConfig } from "./app.routing";

/* Modules */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DndModule } from 'ng2-dnd';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { DynamicComponentModule } from 'angular2-dynamic-component';
// import { SlimLoadingBarService, SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { Ng2BreadcrumbModule } from 'ng2-breadcrumb/ng2-breadcrumb';
// import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { DisqusModule } from 'ngx-disqus';
import { MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@nglibs/meta';
import { ShareButtonsModule } from 'ngx-sharebuttons';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MaterialModule } from '@angular/material';
// import { MdButtonModule, MdCheckboxModule, MdInputModule } from '@angular/material';
import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlDatePickerModule } from '@angular-mdl/datepicker';

/* Services */
import { ElasticService } from "./services/elastic.service"
import { AppService } from "./services/app.service"
// import { MetaService } from './services/meta.service';

/* Components */
import { SiteComponent } from './common/base.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/account/login.component';
import { LogoutComponent } from './components/account/logout.component';

import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/header/menu.component';
// import { SearchInputComponent } from './components/shared/header/search-input.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShareBlockComponent } from './components/shared/share-block/share-block.component';

import { PageComponent } from './components/pages/page.component';
import { SearchListComponent } from './components/search/search-list.component';
import { DigitalPageComponent } from './components/digital/page.component';
import { StaffListComponent } from './components/staff/staff-list.component';
import { StaffDetailComponent } from './components/staff/staff-detail.component';
import { EventListComponent } from './components/events/event-list.component';
import { EventDetailComponent } from './components/events/event-detail.component';
import { ServicesPageComponent } from './components/services/services-page.component';
import { CampaignsPageComponent } from './components/campaigns/campaigns-page.component';
import { BlogListComponent } from './components/posts/post-list.component';
import { BlogPostComponent } from './components/posts/post-detail.component';
import { BriefingListComponent } from './components/posts/briefing-list.component';
import { BriefingPostComponent } from './components/posts/briefing-detail.component';
import { ResearchListComponent } from './components/posts/research-list.component';
import { ResearchPostComponent } from './components/posts/research-detail.component';
import { LibraryListComponent } from './components/library/library-list.component';
import { LibraryDetailComponent } from './components/library/library-detail.component';
import { LoanCalculatorComponent } from './components/credit-union/loan-calculator.component';

import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';

/* Admin Components */
import { AdminComponent } from './components/admin/admin.component';
import { MenuListComponent } from './components/admin/menu-list/menu-list.component';
import { MenuEditorComponent } from './components/admin/menu-editor/menu-editor.component';
import { PageListComponent } from './components/admin/page-list/page-list.component';
import { PageEditorComponent } from './components/admin/page-editor/page-editor.component';
import { InlineEditComponent } from './components/shared/inline-edit/inline-edit.component';
import { TranslationsManagerComponent } from './components/admin/translations-manager/translations-manager.component';

/* Pipes */
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { MapToIterablePipe } from './pipes/map-to-iterable.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { StringToDatePipe } from './pipes/string-to-date.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';

/* Directives */
// none

/* Configuration */
import { firebaseConfig } from './configuration/firebase';

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'SCVO',
    defaults: {
      title: 'Scottish Council for Voluntary Organisations',
      description: 'The membership organisation for Scotland\'s charities, voluntary organisations and social enterprises.',
      'og:image': '',
      'og:type': 'website',
      'og:locale': 'en_GB'
    }
  });
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(rootRouterConfig),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        // MaterializeModule,
        NgbModule.forRoot(),
        DisqusModule,
        MetaModule.forRoot({
          provide: MetaLoader,
          useFactory: (metaFactory)
        }),
        // MaterialModule,
        // NguiAutoCompleteModule,
        MdlModule,
        MdlSelectModule,
        MdlDatePickerModule,
        Ng2BreadcrumbModule.forRoot(),
        DndModule.forRoot(),
        BrowserAnimationsModule,
        MarkdownToHtmlModule,
        DynamicComponentModule,
        // SlimLoadingBarModule.forRoot(),
        ShareButtonsModule.forRoot()
    ],
    declarations: [
        SiteComponent,
        AppComponent,
        HomeComponent,
        LoginComponent,
        LogoutComponent,
        PageComponent,
        SearchListComponent,
        DigitalPageComponent,
        ServicesPageComponent,
        CampaignsPageComponent,
        BlogListComponent,
        BlogPostComponent,
        BriefingListComponent,
        BriefingPostComponent,
        ResearchListComponent,
        ResearchPostComponent,
        StaffListComponent,
        StaffDetailComponent,
        EventListComponent,
        EventDetailComponent,
        LibraryListComponent,
        LibraryDetailComponent,
        LoanCalculatorComponent,
        HeaderComponent,
        MenuComponent,
        // SearchInputComponent,
        FooterComponent,
        PrivacyAndCookiesComponent,
        TermsAndConditionsComponent,
        ShareBlockComponent,
        AdminComponent,
        MenuListComponent,
        MenuEditorComponent,
        PageEditorComponent,
        InlineEditComponent,
        PageListComponent,
        TranslationsManagerComponent,
        MapToIterablePipe,
        MarkdownPipe,
        StringToDatePipe,
        TranslatePipe,
        KeysPipe,
        ReplacePipe,
        SlugifyPipe
    ],
    providers: [
        // SlimLoadingBarService,
        // MetaService,
        ElasticService,
        AppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
