import { GTG } from './_shared/constants'
import { AppPage } from './app-page.po'
import { getExamplesList } from './build.helpers'

const examples = getExamplesList()

examples.forEach(example => {

  describe(`${example} - standard`, () => {
    let page: AppPage

    beforeEach(async () => {
      page = new AppPage(example)
      await page.navigateTo()
    })

    afterEach(async () => {
      await page.ensureNoErrors()
    })

    it('loads without errors', async () => {
      expect(await page.getErrors()).toEqual([])
    })

    it('displays the title text', async () => {
      expect(await page.getTitleText()).toEqual(`BabelMultiTargetPlugin Example:${example}`)
    })

    it('displays the welcome message', async () => {
      expect(await page.getParagraphText()).toEqual(`Welcome to ${example}!`)
    })

    it('displays the "good to go" status text', async () => {
      expect(await page.getStatusText()).toEqual(GTG)
    })

    it('records clicks', async () => {
      await page.click('#welcome')
      const clicks = await page.getClicks()
      expect(clicks.length).toEqual(1)
      if (clicks.length) {
        expect(clicks[0].split(': ')[1]).toEqual('H2')
      }
    })
  })

})
