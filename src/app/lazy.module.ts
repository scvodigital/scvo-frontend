import { environment } from '../environments/environment';

// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

// External Modules
import { DynamicComponentModule } from 'angular2-dynamic-component/index';
import { DisqusModule } from "ngx-disqus";

// Internal Modules
import { rootRouterConfig } from "./app.routing";

// Services
import { RouterService } from './services/router.service';

// Components
import { ScriptHackComponent } from './components/script-hack/script-hack.component';
import { SearchBoxDirective } from './directives/search-box.directive';
import { RouterFormDirective } from './directives/router-form.directive';

// Directives

@NgModule({
    declarations: [
        SearchBoxDirective,
        ScriptHackComponent,
        RouterFormDirective,
    ],
    imports: [
        RouterModule.forChild(rootRouterConfig),
        DisqusModule.forRoot('scottish-council-for-voluntary-organisations'),
        DynamicComponentModule
    ],
    exports: [
        SearchBoxDirective,
        ScriptHackComponent,
        RouterFormDirective,
    ]
})
export class LazyModule { }
