import { ModuleWithProviders }  from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SnoozerComponent } from './snoozer.component'
import { SnoozerGuard }     from './snoozer.guard'

export const routes: Routes = [
  { path: '', component: SnoozerComponent, canActivate: [ SnoozerGuard ] },
]

export const routingProviders: any[] = [
  SnoozerGuard,
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
