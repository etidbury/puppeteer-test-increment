import { ScriptArgs } from '../types'
import { URL_HOMEPAGE } from '../config'

const { interceptWaitForNetworkIdle } = require('@etidbury/helpers/util/puppeteer')

export default async ({ page }: ScriptArgs) => {

    await page.goto(URL_HOMEPAGE, { waitUntil: 'networkidle2' })

    const EXPECTED_TEXT = 'Test number from server'
    // await page.waitForNavigation({ waitUntil: 'networkidle2' })
    //try again

    await interceptWaitForNetworkIdle(page, 5 * 1000)

    // await new Promise((resolve, reject) => {
    //     let inter
    //     networkInterceptListener.on('response.url', () => {
    //         console.log('response.url')
    //         clearTimeout(inter)
    //         inter = setTimeout(function () {
    //             console.log('no more responses')

    //             //@ts-ignore
    //             this.resolve()
    //         }.bind({ resolve }), 5 * 1000)
    //     })
    // })

    const innerText = await page.evaluate((el) => {
        return el.innerText
    }, await page.$('body'))

    if (innerText.indexOf(EXPECTED_TEXT) <= -1) {
        throw new Error(`Failed to find text 'Test number from server' in body`)
    }

}