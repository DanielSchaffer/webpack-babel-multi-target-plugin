import { NgModule }                    from '@angular/core';
import { BrowserModule, EventManager } from '@angular/platform-browser';

import { AppComponent }              from './app.component';
import { routing, routingProviders } from './app.routing';
import { CustomEventManager }        from './custom.event.manager';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        routing,
    ],
    providers: [
        { provide: EventManager, useClass: CustomEventManager },
        routingProviders,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
