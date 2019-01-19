import { RoutingAppPage } from './app-page.po';

describe('angular-routing - routing', () => {

  let page: RoutingAppPage

  beforeEach(() => {
    page = new RoutingAppPage()
  })

  afterEach(async () => {
    await page.ensureNoErrors()
  })

  it('can navigate from the home page to a child page', async () => {
    await page.navigateTo()
    await page.click('a.nav-link[href$="/child"]')

    expect(await page.getRouteTitle()).toEqual(('Child'))
  })

  it('can navigate directly to a child page', async () => {
    await page.navigateTo('child')

    expect(await page.getRouteTitle()).toEqual(('Child'))
  })

  it('can navigate from the home page to a child page to a sub-child page', async () => {
    await page.navigateTo()
    await page.click('a.nav-link[href$="/child"]')

    expect(await page.getRouteTitle()).toEqual(('Child'))

    await page.click('a.nav-link[href$="/child/sub-a"]')

    expect(await page.getSubRouteTitle()).toEqual(('Child Sub-A'))

  })

  it('can navigate directly to a sub-child page', async () => {
    await page.navigateTo('child/sub-a')

    expect(await page.getSubRouteTitle()).toEqual(('Child Sub-A'))
  })

});
