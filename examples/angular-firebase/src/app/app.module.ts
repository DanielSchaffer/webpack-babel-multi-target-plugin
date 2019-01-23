import { BrowserModule, EventManager } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClicksComponent } from './clicks.component';
import { CustomEventManager } from './custom.event.manager';

@NgModule({
  declarations: [
    AppComponent,
    ClicksComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
      { provide: EventManager, useClass: CustomEventManager },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
