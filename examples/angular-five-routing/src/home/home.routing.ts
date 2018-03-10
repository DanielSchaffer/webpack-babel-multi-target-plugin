import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
];

export const routingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
