import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Angulartics2 } from 'angulartics2';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar/ng2-slim-loading-bar';
import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { RouterModule } from "@angular/router";
import { rootRouterConfig } from "./app.routing";

import { ElasticService } from "./services/elastic.service"
import { DrupalService } from "./services/drupal.service"
import { AppService } from "./services/app.service"

import { AppComponent } from './app.component';

import { HomeComponent } from './components/static/home.component';
import { PrivacyAndCookiesComponent } from './components/static/privacy-and-cookies.component';
import { TermsAndConditionsComponent } from './components/static/terms-and-conditions.component';
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

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(rootRouterConfig)
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PrivacyAndCookiesComponent,
        TermsAndConditionsComponent,
        SiteSearchComponent,
        DrupalRedirectComponent,
        DrupalPageComponent,
        DrupalPostComponent,
        DrupalIndexComponent,
        DrupalMediaCentreComponent,
        CJSSearchComponent,
        GoodmovesSearchComponent,
        TrainingSearchComponent,
        TrainingResultComponent
    ],
    providers: [
        Angulartics2,
        SlimLoadingBarService,
        BreadcrumbService,
        ElasticService,
        DrupalService,
        AppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
