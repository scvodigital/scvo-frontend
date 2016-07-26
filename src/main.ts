// main entry point
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { provideForms, disableDeprecatedForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';

import { Angulartics2 } from 'angulartics2';
// import { Angulartics2Deprecated } from './app/services/angulartics2-deprecated';

import { ElasticService } from "./app/services/elastic.service"
import { DrupalService } from "./app/services/drupal.service"

enableProdMode();

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    // provide(Angulartics2, {useClass: Angulartics2Deprecated}),
    Angulartics2,
    ElasticService
])
.catch(err => console.error(err));
