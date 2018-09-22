import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { NO_NG_ZONE_SUFFIX } from './custom.event.manager';

import { firebase } from '@firebase/app';
import '@firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';

  private f = new Subject<number>();

  constructor() {
      setInterval(() => this.f.next(new Date().valueOf()), 500);

      firebase.initializeApp({
          apiKey: "AIzaSyA9tQLQ5WJOBS7-e9zcdGkRKjaroRI0T18",
          authDomain: "test-59779.firebaseapp.com",
          databaseURL: "https://test-59779.firebaseio.com",
          projectId: "test-59779",
          storageBucket: "",
          messagingSenderId: "289255988111"
      });

      console.log('firebase.auth', firebase.auth);
  }

  public ngOnInit(): void {
      this.f.subscribe((ts: number) => console.log('rxjs', ts));
  }

  @HostListener(`window${NO_NG_ZONE_SUFFIX}:mousedown`, ['$event'])
  private onMouseDown(e: MouseEvent): void {
      console.log('onMouseDown', e);
  }

}
