import { Routes } from '@angular/router';

import { RouterComponent } from './components/router/router.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const rootRouterConfig: Routes = [
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: RouterComponent }
];
