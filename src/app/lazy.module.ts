import { environment } from '../environments/environment';

// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

// External Modules
import { DynamicComponentModule } from 'angular2-dynamic-component/index';

// Internal Modules
import { rootRouterConfig } from "./app.routing";

// Services
import { RouterService } from './services/router.service';

// Components
import { ScriptHackComponent } from './components/script-hack/script-hack.component';
import { SearchBoxDirective } from './directives/search-box.directive';

// Directives

@NgModule({
    declarations: [
        SearchBoxDirective,
        ScriptHackComponent,
    ],
    imports: [
        RouterModule.forChild(rootRouterConfig),
        DynamicComponentModule
    ],
    exports: [
        SearchBoxDirective,
        ScriptHackComponent,
    ]
})
export class LazyModule { }
