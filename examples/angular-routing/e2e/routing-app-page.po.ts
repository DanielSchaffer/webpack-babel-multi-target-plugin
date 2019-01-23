import { by, element } from 'protractor';
import { AppPage } from '../../app-page.po';

export class RoutingAppPage extends AppPage {

  constructor() {
    super('angular-routing')
  }

  getRouteTitle() {
    return element(by.css('#router-outlet h3')).getText()
  }

  getSubRouteTitle() {
    return element(by.css('#router-outlet h4')).getText()
  }

}
