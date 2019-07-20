import { ScriptArgs } from '../types'
import { URL_HOMEPAGE } from '../config'

export default async ({ browser, page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE, { waitUntil: 'networkidle2' })

    const EXPECTED_TEXT = 'Test number from server'
    // await page.waitForNavigation({ waitUntil: 'networkidle2' })
    //try again
    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text 'Test number from server' in body`)
    }

}