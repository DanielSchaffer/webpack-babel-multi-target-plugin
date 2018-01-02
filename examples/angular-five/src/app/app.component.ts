import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { NO_NG_ZONE_SUFFIX } from './custom.event.manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';

  private f = new Subject<number>();

  constructor() {
      setInterval(() => this.f.next(new Date().valueOf()), 500);
  }

  public ngOnInit(): void {
      this.f.subscribe(ts => console.log('rxjs', ts));
  }

  @HostListener(`window${NO_NG_ZONE_SUFFIX}:mousedown`, ['$event'])
  private onMouseDown(e: MouseEvent): void {
      console.log('onMouseDown', e);
  }

}
