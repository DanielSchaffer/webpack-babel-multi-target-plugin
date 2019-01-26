import { NgModule } from '@angular/core'

import { SubAComponent }             from './sub.a.component'
import { routing, routingProviders } from './sub.a.routing'

@NgModule({
  declarations: [
    SubAComponent,
  ],
  imports: [
    routing,
  ],
  exports: [
    SubAComponent,
  ],
  providers: [
    routingProviders,
  ],

})
export class SubAModule {}
