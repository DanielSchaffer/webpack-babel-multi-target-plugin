import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'

import { firebase } from '@firebase/app'
import '@firebase/auth'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {


  public readonly title = 'angular-firebase'
  public message: string

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}

  public ngOnInit(): void {
    firebase.initializeApp({
      apiKey: 'AIzaSyA9tQLQ5WJOBS7-e9zcdGkRKjaroRI0T18',
      authDomain: 'test-59779.firebaseapp.com',
      databaseURL: 'https://test-59779.firebaseio.com',
      projectId: 'test-59779',
      storageBucket: '',
      messagingSenderId: '289255988111'
    });
    this.message = 'good to go!'
    this.renderer.setStyle(this.document.body.parentElement, 'background', 'green')
  }

}
