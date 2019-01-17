import { browser, by, element } from 'protractor';

export class AppPage {

  constructor(private exampleName: string) {}

  navigateTo() {
    return browser.get(`/examples/${this.exampleName}/`);
  }

  getParagraphText() {
    return element(by.css('#welcome')).getText();
  }

  getGtGText() {
    return element(by.css('#good-to-go')).getText();
  }

  async getErrors() {
    return element.all(by.css('errors>error')).map((el: any) => el.getText())
    // return browser.manage().logs().get(logging.Type.BROWSER)
  }
}
