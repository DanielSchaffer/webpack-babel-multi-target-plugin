import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app';

  private f = new Subject<number>();

  constructor() {
      setInterval(() => this.f.next(new Date().valueOf()), 500);
  }

  public ngOnInit(): void {
      this.f.subscribe(ts => console.log('rxjs', ts));
  }
}
