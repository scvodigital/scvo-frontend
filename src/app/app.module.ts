import { environment } from '../environments/environment';
import 'handlebars/dist/handlebars.min.js';

// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HttpModule } from '@angular/http';

// External Modules
import { DynamicComponentModule } from 'angular2-dynamic-component/index';

// Internal Modules
import { rootRouterConfig } from "./app.routing";

// Services
import { RouterService } from './services/router.service';

// Components
import { AppComponent } from './app.component';
import { RouterComponent } from './components/router/router.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchBoxDirective } from './directives/search-box.directive';

// Directives

@NgModule({
  declarations: [
    AppComponent,
    RouterComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig),
    DynamicComponentModule
  ],
  providers: [
    RouterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
