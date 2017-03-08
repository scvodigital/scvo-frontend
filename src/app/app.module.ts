import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { rootRouterConfig } from "./app.routing";

import { AngularFireModule } from 'angularfire2';
// import { Angulartics2 } from 'angulartics2';
import { SlimLoadingBarService, SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';
import { MaterializeDirective, MaterializeModule } from 'angular2-materialize';

/* Services */
import { ElasticService } from "./services/elastic.service"
import { DrupalService } from "./services/drupal.service"
import { AppService } from "./services/app.service"

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './components/static/home.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { MenuComponent } from './components/shared/header/menu.component';
import { SearchInputComponent } from './components/shared/header/search-input.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AboutComponent } from './components/static/about.component';
import { HelpComponent } from './components/static/help.component';
import { PolicyComponent } from './components/static/policy.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';
import { SiteSearchComponent } from './components/dynamic/search/site/elastic-results.component';
import { DrupalRedirectComponent } from './components/dynamic/cms/drupal-redirect.component';
import { DrupalPageComponent } from './components/dynamic/cms/drupal-page.component';
import { DrupalPostComponent } from './components/dynamic/cms/drupal-post.component';
import { DrupalPostListComponent } from './components/dynamic/cms/drupal-post-list.component';
import { DrupalIndexComponent } from './components/dynamic/cms/drupal-index.component';
import { DrupalMediaCentreComponent } from './components/dynamic/cms/drupal-media-centre.component';
import { CJSSearchComponent } from './components/dynamic/search/cjs/elastic-results.component';
import { GoodmovesSearchComponent } from './components/dynamic/search/goodmoves/elastic-results.component';
import { TrainingSearchComponent } from './components/dynamic/search/training/elastic-results.component';
import { TrainingResultComponent } from './components/dynamic/search/training/elastic-result-detail.component';

/* Pipes */
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { MapToIterablePipe } from './pipes/map-to-iterable.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { StringToDatePipe } from './pipes/string-to-date.pipe';

/* Directives */


/* Firebase */
export const firebaseConfig = {
    apiKey: "AIzaSyDQl9Xs3yzgqBEr4dYAeu19NMDh8X9hJ6A",
    authDomain: "scvo-frontend.firebaseapp.com",
    databaseURL: "https://scvo-frontend.firebaseio.com",
    storageBucket: "scvo-frontend.appspot.com",
    messagingSenderId: "814304031954"
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(rootRouterConfig),
        AngularFireModule.initializeApp(firebaseConfig),
        ReactiveFormsModule,
        MarkdownToHtmlModule,
        MaterializeModule,
        SlimLoadingBarModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        MenuComponent,
        SearchInputComponent,
        FooterComponent,
        AboutComponent,
        HelpComponent,
        PolicyComponent,
        PrivacyAndCookiesComponent,
        TermsAndConditionsComponent,
        SiteSearchComponent,
        DrupalIndexComponent,
        DrupalMediaCentreComponent,
        DrupalPageComponent,
        DrupalPostListComponent,
        DrupalPostComponent,
        DrupalRedirectComponent,
        CJSSearchComponent,
        GoodmovesSearchComponent,
        TrainingSearchComponent,
        TrainingResultComponent
    ],
    providers: [
        // Angulartics2,
        SlimLoadingBarService,
        BreadcrumbService,
        ElasticService,
        DrupalService,
        AppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
