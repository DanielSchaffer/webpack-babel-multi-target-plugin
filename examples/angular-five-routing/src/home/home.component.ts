import { Component } from '@angular/core';
import * as rxjs from 'rxjs/Rx';

import { sharedHomeChildValue } from '../shared/shared.home.child';

@Component({
    selector: 'home',
    templateUrl: 'home.component.pug',
    styleUrls: ['home.component.scss'],
})
export class HomeComponent {

    constructor() {
        console.log('HomeComponent.ctr');
        console.log('sharedHomeChildValue', sharedHomeChildValue);
        const o = rxjs.Observable.create();
    }

}
