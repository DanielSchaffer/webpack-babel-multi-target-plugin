import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

const GTG = 'good to go!'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.pug',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    public readonly title = 'angular-routing'
    public message: string

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private renderer: Renderer2,
      private router: Router,
    ) {}

    public ngOnInit(): void {
        this.message = GTG
        this.renderer.setStyle(this.document.body.parentElement, 'background', 'green')

      this.router.events.subscribe(e => {
        if (e instanceof NavigationStart) {
          this.message = 'navigating...'
          return
        }
        if (e instanceof NavigationEnd) {
          this.message = GTG
          return
        }
        if (e instanceof NavigationError) {
          this.message = e.error && e.error.message
          return
        }
      })
    }

}
