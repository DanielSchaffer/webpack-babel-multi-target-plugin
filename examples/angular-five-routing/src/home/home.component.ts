import { Component } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: 'home.component.pug',
    styleUrls: ['home.component.scss'],
})
export class HomeComponent {

    constructor() {
        console.log('HomeComponent.ctr');
    }

}
