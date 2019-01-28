import { Component } from '@angular/core'

@Component({
  selector: 'sub-a',
  templateUrl: 'sub.a.component.pug',
  styleUrls: ['sub.a.component.scss'],
})
export class SubAComponent {

  constructor() {
    console.log('SubAComponent.ctr')
  }

}
