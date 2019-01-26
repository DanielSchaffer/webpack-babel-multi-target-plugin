import { RoutingAppPage } from './routing-app-page.po'

describe('angular-routing - routing', () => {

  let page: RoutingAppPage

  beforeEach(() => {
    page = new RoutingAppPage()
  })

  afterEach(async () => {
    await page.ensureNoErrors()
  })

  it('navigates from the home page to a child page', async () => {
    await page.navigateTo()

    await page.click('a.nav-link[href$="/child"]')
    await page.waitForGtG()
    // await page.pause(250)

    expect(await page.getRouteTitle()).toEqual(('Child'))
  })

  it('navigates directly to a child page', async () => {
    await page.navigateTo('child')
    await page.waitForGtG()

    expect(await page.getRouteTitle()).toEqual(('Child'))
  })

  it('navigates from the home page to a child page to a sub-child page', async () => {
    await page.navigateTo()

    await page.click('a.nav-link[href$="/child"]')
    await page.waitForGtG()
    // await page.pause(250)

    expect(await page.getRouteTitle()).toEqual(('Child'))

    await page.click('a.nav-link[href$="/child/sub-a"]')
    await page.waitForGtG()
    // await page.pause(250)

    expect(await page.getSubRouteTitle()).toEqual(('Child Sub-A'))

  })

  it('navigates directly to a sub-child page', async () => {
    await page.navigateTo('child/sub-a')
    await page.waitForGtG()

    expect(await page.getSubRouteTitle()).toEqual(('Child Sub-A'))
  })

})
