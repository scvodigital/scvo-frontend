import { Routes } from '@angular/router';

import { RouterComponent } from './components/router/router.component';

export const rootRouterConfig: Routes = [
    { path: '**', component: RouterComponent }
];
