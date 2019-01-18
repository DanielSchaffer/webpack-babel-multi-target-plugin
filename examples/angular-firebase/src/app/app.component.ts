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
  title = 'angular-firebase';
  message: string;

  private f = new Subject<string>();

  public ngOnInit(): void {
    firebase.initializeApp({
      apiKey: "AIzaSyA9tQLQ5WJOBS7-e9zcdGkRKjaroRI0T18",
      authDomain: "test-59779.firebaseapp.com",
      databaseURL: "https://test-59779.firebaseio.com",
      projectId: "test-59779",
      storageBucket: "",
      messagingSenderId: "289255988111"
    });
    this.f.subscribe(message => console.log('rxjs', message));
    this.message = 'good to go!'
  }

  @HostListener(`window${NO_NG_ZONE_SUFFIX}:mousedown`, ['$event'])
  private onMouseDown(): void {
    this.f.next('click!')
  }

}
