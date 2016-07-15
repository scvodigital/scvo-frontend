// main entry point
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';

import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';

import { provideForms, disableDeprecatedForms } from '@angular/forms';

import { Angulartics2 } from 'angulartics2';
import { Angulartics2Deprecated } from './app/services/angulartics2-deprecated';

enableProdMode();

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    provide(Angulartics2, {useClass: Angulartics2Deprecated})
])
.catch(err => console.error(err));
