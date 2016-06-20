import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide, enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';

import { App } from './app/app.component';

import { ElasticSearchService } from "./app/components/shared/elasticsearch.service"

enableProdMode();

bootstrap(App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: PathLocationStrategy}),
    ElasticSearchService
])
.catch(err => console.error(err));
