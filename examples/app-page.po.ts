import { browser, by, element } from 'protractor';

export interface E2EConfig {
  angular?: boolean
  e2e_ready?: boolean
}

export class AppPage {

  private e2eConfig: E2EConfig

  constructor(private exampleName: string) {
    try {
      this.e2eConfig = require(`./${exampleName}/e2e-config.json`)
    } catch (err) {
      this.e2eConfig = {
        angular: true,
        e2e_ready: false,
      }
    }
  }

  async navigateTo(route?: string) {
    if (!this.e2eConfig.angular) {
      await browser.waitForAngularEnabled(false)
    }

    await browser.get(`/examples/${this.exampleName}/${route || ''}`)

    if (this.e2eConfig.e2e_ready) {
      await browser.wait(async () => (await browser.executeScript('return window.__e2e_ready')) === true)
    }
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
    return element.all(by.css('clicks .click,#clicks .click')).map((el: any) => el.getText()) as any
  }

  click(selector: string) {
    return element(by.css(selector)).click()
  }

  async ensureNoErrors() {
    expect(await this.getErrors()).toEqual([])
  }
}
