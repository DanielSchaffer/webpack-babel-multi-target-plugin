import { BrowserModule, EventManager } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomEventManager } from './custom.event.manager';

@NgModule({
  declarations: [
    AppComponent
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
