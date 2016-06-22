// main entry point
import { bootstrap }            from '@angular/platform-browser-dynamic';
import { AppComponent }         from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { enableProdMode }       from '@angular/core';
import { provideForms }         from '@angular/forms';

enableProdMode();

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    provideForms()
])
.catch(err => console.error(err));
