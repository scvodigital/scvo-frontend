// main entry point
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { provideForms, disableDeprecatedForms } from '@angular/forms';

// import 'angular2-materialize';

enableProdMode();

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    disableDeprecatedForms(),
    provideForms()
])
.catch(err => console.error(err));
