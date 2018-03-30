import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SubAComponent } from './sub.a.component';

export const routes: Routes = [
    { path: '', component: SubAComponent },
];

export const routingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
