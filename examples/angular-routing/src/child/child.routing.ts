import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildComponent } from './child.component';

export const routes: Routes = [
    { path: '', component: ChildComponent },
    { path: 'sub-a', loadChildren: './sub-a/sub.a.module#SubAModule' },
    { path: 'sub-b', loadChildren: './sub-b/sub.b.module#SubBModule' },
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
