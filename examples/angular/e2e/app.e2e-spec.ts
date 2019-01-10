import { AppPage } from './app.po';

describe('angular-five App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
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
