import { browser, by, Capabilities, element } from 'protractor';

export interface E2EConfig {
  angular?: boolean
  e2e_ready?: boolean
}

export class AppPage {

  public readonly ready: Promise<void>

  private e2eConfig: E2EConfig
  private capabilities: Capabilities

  constructor(private exampleName: string) {
    try {
      this.e2eConfig = require(`./${exampleName}/e2e-config.json`)
    } catch (err) {
      this.e2eConfig = {
        angular: true,
        e2e_ready: false,
      }
    }

    this.ready = this.init()
  }

  private async init(): Promise<void> {
    this.capabilities = await browser.getCapabilities()
  }

  async navigateTo(route?: string) {
    if (!this.e2eConfig.angular) {
      await browser.waitForAngularEnabled(false)
    }

    const navigated = browser.get(`/examples/${this.exampleName}/${route || ''}`)

    if (this.capabilities.get('browserName') === 'internet explorer') {
      console.log('IE: waiting for readyState')
      await browser.wait(async () => {
        const result = await browser.executeScript('return document.readyState')
        console.log('readyState', result)
        return result && result !== 'loading'
      })
    }

    await navigated

    if (this.e2eConfig.e2e_ready) {
      await browser.wait(async () => {
        const result = (await browser.executeScript('return window.__e2e_ready'))
        console.log('e2e_ready', result)
        return result === true
      })
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
