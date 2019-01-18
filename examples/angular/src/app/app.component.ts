import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { NO_NG_ZONE_SUFFIX } from './custom.event.manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular';

  public message: string;

  public ngOnInit(): void {
    this.message = 'good to go!'
  }

}
