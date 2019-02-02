import { Component } from '@angular/core'

@Component({
  selector: 'snoozer',
  templateUrl: 'snoozer.component.pug',
  styleUrls: ['./snoozer.component.scss'],
})
export class SnoozerComponent {

  constructor() {
    console.log('SnoozerComponent.ctr')
  }

}
