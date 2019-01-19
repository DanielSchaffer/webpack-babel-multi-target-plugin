import { browser, by, element } from 'protractor';

export class AppPage {

  constructor(private exampleName: string) {}

  navigateTo(route?: string) {
    return browser.get(`/examples/${this.exampleName}/${route || ''}`)
  }

  getTitleText() {
    return element(by.css('#title')).getText()
  }

  getParagraphText() {
    return element(by.css('#welcome')).getText()
  }

  getStatusText() {
    return element(by.css('#status > .message')).getText()
  }

  getErrors() {
    return element.all(by.css('errors > error')).map((el: any) => el.getText())
    // return browser.manage().logs().get(logging.Type.BROWSER)
  }

  getClicks(): Promise<string[]> {
    return element.all(by.css('clicks > .click')).map((el: any) => el.getText()) as any
  }

  click(selector: string) {
    return element(by.css(selector)).click()
  }

  async ensureNoErrors() {
    expect(await this.getErrors()).toEqual([])
  }
}
