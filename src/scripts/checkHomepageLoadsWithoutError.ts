import { ScriptArgs } from '../types'
import { URL_HOMEPAGE } from '../config'

const { interceptWaitForNetworkIdle } = require('@etidbury/helpers/util/puppeteer')

export default async ({ page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE)

    const EXPECTED_TEXT = 'Test number from server'

    console.debug('Waiting for network to be idle')
    await interceptWaitForNetworkIdle(page, 5 * 1000)
    console.debug('Network now idle')
    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text 'Test number from server' in body`)
    }

}