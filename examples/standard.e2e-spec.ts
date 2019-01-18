import { AppPage } from './app-page.po';
import { getExamplesList } from './build.helpers';

const examples = getExamplesList()

examples.forEach(example => {

  console.log('adding spec for', example)

  describe(`Example: ${example}`, () => {
    let page: AppPage;

    beforeEach(async () => {
      page = new AppPage(example)
      await page.navigateTo()
    })

    afterEach(async () => {
      expect(await page.getErrors()).toEqual([])
    })

    it('should not have any errors', async () => {
      expect(await page.getErrors()).toEqual([])
    })

    it('should display the title text', async () => {
      expect(await page.getTitleText()).toEqual(`BabelMultiTargetPlugin Example:${example}`)
    })

    it('should display the welcome message', async () => {
      expect(await page.getParagraphText()).toEqual(`Welcome to ${example}!`);
    })

    it('should display the "good to go" status text', async () => {
      expect(await page.getStatusText()).toEqual('good to go!');
    })

    it('should record clicks', async () => {
      await page.click('#welcome')
      const clicks = await page.getClicks()
      expect(clicks.length).toEqual(1)
      expect(clicks[0].split(': ')[1]).toEqual('H2')
    })
  });

})
