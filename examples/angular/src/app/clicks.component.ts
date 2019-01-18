import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { NO_NG_ZONE_SUFFIX } from './custom.event.manager';

interface Click {
  ts: number
  tagName: string
}

@Component({
  selector: 'clicks',
  templateUrl: 'clicks.component.pug',
})
export class ClicksComponent implements OnInit {

  private f = new Subject<Click>()
  public clicks: Click[] = []

  constructor(private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.f.subscribe(click => {
      this.ngZone.run(() => this.clicks.push(click))
    })
  }

  @HostListener(`window${NO_NG_ZONE_SUFFIX}:mousedown`, ['$event'])
  private onMouseDown(e: MouseEvent): void {
    this.f.next({
      ts: new Date().valueOf(),
      tagName: (e.target as Element).tagName,
    })
  }
}
