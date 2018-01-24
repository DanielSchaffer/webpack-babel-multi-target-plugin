import { CommonModule } from '@angular/common';
import { BrowserModule, EventManager } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, routingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { CustomEventManager } from './custom.event.manager';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      BrowserModule,
      CommonModule,
      routing
  ],
  providers: [
      { provide: EventManager, useClass: CustomEventManager },
      routingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
