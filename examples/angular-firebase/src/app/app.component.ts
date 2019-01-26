import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'

import { firebase } from '@firebase/app'
import '@firebase/auth'

import { GTG } from '../../../_shared/constants'
import ready from '../../../_shared/ready'

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
      messagingSenderId: '289255988111',
    })
    this.message = GTG
    this.renderer.setStyle(this.document.body.parentElement, 'background', 'green')

    // use e2e ready since firebase uses an interval to poll for auth updates, which breaks protractor's angular
    // ready detection
    ready()
  }

}
