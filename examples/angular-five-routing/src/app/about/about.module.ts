import { NgModule } from '@angular/core';

import { AboutComponent } from './about.component';
import { routing, routingProviders } from './about.routing';

@NgModule({
    declarations: [
        AboutComponent,
    ],
    imports: [
        routing,
    ],
    exports: [
        AboutComponent,
    ],
    providers: [
        routingProviders,
    ],

})
export class HomeModule {}
