import { ScriptArgs } from '../types'

import {
    SELECTOR_BTN_LOCAL_TEST_NUMBER_INCREMENT
    , SELECTOR_BTN_SERVER_TEST_NUMBER_INCREMENT
    , SELECTOR_CONTAINER_LOCAL_TEST_NUMBER
    , SELECTOR_CONTAINER_SERVER_TEST_NUMBER
    , URL_HOMEPAGE
} from '../config'

const {
    HOST,
    PORT,
    // GOOGLE_TEST_USERNAME,
    // GOOGLE_TEST_PASSWORD,
    // API_BASE_URL
} = process.env

// import {takeScreenshotAndUploadToS3} from '@etidbury/ts-next-helpers/util/test'


export default async ({ browser, page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE, { waitUntil: "networkidle2" })

    const EXPECTED_TEXT = 'Local increment number'

    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text '${EXPECTED_TEXT}' in body`)
    }

}