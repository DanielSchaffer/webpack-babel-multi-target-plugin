import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { routing, routingProviders } from './home.routing';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        routing,
    ],
    exports: [
        HomeComponent,
    ],
    providers: [
        routingProviders,
    ],

})
export class HomeModule {}
