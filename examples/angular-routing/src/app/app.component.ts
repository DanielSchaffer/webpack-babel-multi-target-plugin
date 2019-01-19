import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.pug',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    public readonly title = 'angular-routing'
    public message: string

    constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}

    public ngOnInit(): void {
        this.message = 'good to go!'
        this.renderer.setStyle(this.document.body.parentElement, 'background', 'green')
    }

}
