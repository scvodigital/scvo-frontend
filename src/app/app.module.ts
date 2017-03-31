import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { rootRouterConfig } from "./app.routing";

import { AngularFireModule } from 'angularfire2';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { SlimLoadingBarService, SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';
import { MaterializeDirective, MaterializeModule } from 'angular2-materialize';

/* Services */
import { ElasticService } from "./services/elastic.service"
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
// none

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
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
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
        CJSSearchComponent,
        GoodmovesSearchComponent,
        TrainingSearchComponent,
        TrainingResultComponent,
        MapToIterablePipe,
        MarkdownPipe,
        StringToDatePipe
    ],
    providers: [
        // Angulartics2,
        SlimLoadingBarService,
        BreadcrumbService,
        ElasticService,
        AppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
