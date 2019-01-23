import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { sharedHomeChildValue } from '../shared/shared.home.child';

@Component({
  selector: 'child',
  templateUrl: './child.component.pug',
  styleUrls: ['./child.component.scss'],
})
export class ChildComponent {

    constructor() {
        console.log('sharedHomeChildValue', sharedHomeChildValue);
        const o = Observable.create();
    }

}
