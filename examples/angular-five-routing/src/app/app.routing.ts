import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    // pathMatch: 'full' required on "home" route to ensure that it is only loaded
    // when the location is / - otherwise it will match for every route
    { path: '', loadChildren: '../home/home.module#HomeModule', pathMatch: 'full' },
    { path: 'snoozer', loadChildren: '../snoozer/snoozer.module#SnoozerModule' },
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
