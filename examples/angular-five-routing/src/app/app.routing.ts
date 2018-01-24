import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '',         loadChildren: './home/home.module#HomeModule' },

    { path: 'the-form', loadChildren: './the-form/the.form.module#TheFormModule' }
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);