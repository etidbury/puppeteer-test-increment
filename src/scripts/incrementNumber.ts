import { ScriptArgs } from '../types'
import { URL_HOMEPAGE } from '../config'
const { interceptWaitForNetworkIdle } = require('@etidbury/helpers/util/puppeteer')

export default async ({ browser, page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE)

    await interceptWaitForNetworkIdle(page, 5 * 1000)

    const EXPECTED_TEXT = 'Test number from server'
    // await page.waitForNavigation({ waitUntil: 'networkidle2' })
    //try again
    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text 'Test number from server' in body`)
    }

    const originalServerIncrement = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('#server-test-number'))

    // await page.waitFor(4000)



    await page.click('#btn-server-test-number-increment')

    console.debug('Clicked server increment')

    await interceptWaitForNetworkIdle(page, 5 * 1000)

    console.debug('Network idle.')

    await page.waitFor(2 * 1000) //wait for re-render

    const afterServerIncrement = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('#server-test-number'))

    console.debug(`Server increment - before:${originalServerIncrement} after:${afterServerIncrement}`)

    if (parseInt(originalServerIncrement) + 1 !== parseInt(afterServerIncrement)) {
        throw new Error('Server number was not incremented by 1!')
    }

}