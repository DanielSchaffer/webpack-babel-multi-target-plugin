import { NgModule } from '@angular/core';

import { SnoozerComponent }          from './snoozer.component';
import { routing, routingProviders } from './snoozer.routing';

@NgModule({
    declarations: [
        SnoozerComponent,
    ],
    imports: [
        routing,
    ],
    exports: [
        SnoozerComponent,
    ],
    providers: [
        routingProviders,
    ],

})
export class SnoozerModule {}
