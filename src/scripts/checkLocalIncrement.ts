import { ScriptArgs } from '../types'

import {
    URL_HOMEPAGE
} from '../config'

// import {takeScreenshotAndUploadToS3} from '@etidbury/ts-next-helpers/util/test'

const { interceptWaitForNetworkIdle } = require('@etidbury/helpers/util/puppeteer')

export default async ({ browser, page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE)

    await interceptWaitForNetworkIdle(page, 5 * 1000)

    const EXPECTED_TEXT = 'Local increment number'

    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text '${EXPECTED_TEXT}' in body`)
    }

}