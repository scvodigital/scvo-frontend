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
import { RouterFormDirective } from './directives/router-form.directive';

// Directives

@NgModule({
    declarations: [
        RouterFormDirective,
    ],
    imports: [
        RouterModule.forChild(rootRouterConfig),
        DynamicComponentModule
    ],
    exports: [
        RouterFormDirective,
    ]
})
export class LazyModule { }
