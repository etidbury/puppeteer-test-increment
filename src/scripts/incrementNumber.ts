import { ScriptArgs } from '../types'
import { URL_HOMEPAGE } from '../config'

export default async ({ browser, page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE, { waitUntil: 'networkidle0' })

    const EXPECTED_TEXT = 'Test number from server'
    // await page.waitForNavigation({ waitUntil: 'networkidle2' })
    //try again
    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text 'Test number from server' in body`)
    }


    // await page.waitFor(4000)



    await page.click('#btn-server-test-number-increment')

    console.debug('Clicked server increment')

    await Promise.race([
        page.waitForNavigation({ waitUntil: "networkidle0" })
    ]);

    page.on('request', interceptedRequest => {
        console.debug('intercepted', interceptedRequest.url())
        interceptedRequest.continue()
        // if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        //     interceptedRequest.abort();
        // else
        //     interceptedRequest.continue();
    });

    page.on('requestfinished', interceptedRequest => {
        console.debug('intercepted finished', interceptedRequest.url())
        interceptedRequest.continue()
        // if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        //     interceptedRequest.abort();
        // else
        //     interceptedRequest.continue();
    });

    page.on('response', interceptedRequest => {
        console.debug('intercepted response', interceptedRequest.url())

        // if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        //     interceptedRequest.abort();
        // else
        //     interceptedRequest.continue();
    });

    console.debug('Network idle.')

}