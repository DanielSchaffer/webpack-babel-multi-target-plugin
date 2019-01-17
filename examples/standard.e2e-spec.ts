import { AppPage } from './app-page.po';
import { getExamplesList } from './build.helpers';

const examples = getExamplesList()

examples.forEach(example => {

  console.log('adding spec for', example)

  describe(`Example: ${example}`, () => {
    let page: AppPage;

    beforeEach(() => {
      page = new AppPage(example);
    });

    it('should not have any errors', async () => {
      await page.navigateTo()
      expect(await page.getErrors()).toEqual([])
    })

    it('should display welcome message', async () => {
      await page.navigateTo();
      expect(await page.getParagraphText()).toEqual('Welcome to app!');
    });

    it('should display the "good to go" text', async () => {
      await page.navigateTo();
      expect(await page.getGtGText()).toEqual('good to go!');
    });
  });

})
