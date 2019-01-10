import { browser, by, element } from 'protractor';

export class AppPage {
  async navigateTo() {
    await browser.waitForAngularEnabled(false)
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getGtGText() {
    return element(by.css('app-root div p')).getText();
  }

  async getErrors() {
    return element.all(by.css('errors>error')).map((el: any) => el.getText())
    // return browser.manage().logs().get(logging.Type.BROWSER)
  }
}
