import { ModuleWithProviders }  from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SubBComponent } from './sub.b.component'

export const routes: Routes = [
  { path: ':param', component: SubBComponent },
]

export const routingProviders: any[] = [
]

export const routing: ModuleWithProviders = RouterModule.forChild(routes)
