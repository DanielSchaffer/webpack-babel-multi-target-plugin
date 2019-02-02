import { NgModule }      from '@angular/core'

import { ChildComponent }            from './child.component'
import { routing, routingProviders } from './child.routing'

@NgModule({
  declarations: [
    ChildComponent,
  ],
  imports: [
    routing,
  ],
  providers: [
    routingProviders,
  ],
})
export class ChildModule { }
