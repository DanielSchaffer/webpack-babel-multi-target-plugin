import { browser, by, Capabilities, element } from 'protractor'

import { GTG, GTG_TIMEOUT } from './_shared/constants'

export interface E2EConfig {
  angular?: boolean
  // eslint-disable-next-line camelcase
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
        // eslint-disable-next-line camelcase
        e2e_ready: false,
      }
    }

    this.ready = this.init()
  }

  private async init(): Promise<void> {
    this.capabilities = await browser.getCapabilities()
  }

  public async navigateTo(route?: string): Promise<void> {

    await this.ready

    await browser.waitForAngularEnabled(this.e2eConfig.angular)

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
        // console.log('e2e_ready', result)
        return result === true
      })
    }
  }

  public async getText(selector: string): Promise<string> {
    const text = await element(by.css(selector)).getText()
    return text.trim()
  }

  public getTitleText(): Promise<string> {
    return this.getText('#title')
  }

  public getParagraphText(): Promise<string> {
    return this.getText('#welcome')
  }

  public getStatusText(): Promise<string> {
    return this.getText('#status > .message')
  }

  public async getErrors(): Promise<string[]> {
    return element.all(by.css('errors > error')).map((el: any) => el.getText())
    // return browser.manage().logs().get(logging.Type.BROWSER)
  }

  public async waitForGtG(): Promise<boolean> {
    return browser.wait(async () => (await this.getStatusText()) === GTG, GTG_TIMEOUT)
  }

  public pause(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  public async getClicks(): Promise<string[]> {
    const text = await element.all(by.css('clicks .click,#clicks .click')).map((el: any) => el.getText()) as any
    return text.map((t: string) => t.trim())
  }

  public async click(selector: string): Promise<void> {
    return element(by.css(selector)).click()
  }

  public async ensureNoErrors(): Promise<void> {
    expect(await this.getErrors()).toEqual([])
  }
}
