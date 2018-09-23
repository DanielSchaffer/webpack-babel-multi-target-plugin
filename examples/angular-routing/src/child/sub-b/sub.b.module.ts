import { NgModule } from '@angular/core';

import { SubBComponent }             from './sub.b.component';
import { routing, routingProviders } from './sub.b.routing';

@NgModule({
    declarations: [
        SubBComponent,
    ],
    imports: [
        routing,
    ],
    exports: [
        SubBComponent,
    ],
    providers: [
        routingProviders,
    ],

})
export class SubBModule {}
