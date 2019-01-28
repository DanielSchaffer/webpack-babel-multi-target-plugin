import { Component } from '@angular/core'

@Component({
  selector: 'sub-b',
  templateUrl: 'sub.b.component.pug',
  styleUrls: ['sub.b.component.scss'],
})
export class SubBComponent {

  constructor() {
    console.log('SubBComponent.ctr')
  }

}
