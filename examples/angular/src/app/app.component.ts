import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'

import { GTG } from '../../../_shared/constants'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public readonly title = 'angular'
  public message: string

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}

  public ngOnInit(): void {
    console.log('angular init')
    this.message = GTG
    this.renderer.setStyle(this.document.body.parentElement, 'background', 'green')
  }

}
