import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    // { path: '',      loadChildren: './home/home.module#HomeModule' },

    { path: 'about', loadChildren: './about/about.module#AboutModule' }
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
