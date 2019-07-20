import * as path from 'path'

require('dotenv-safe').config({
    path: path.join(process.cwd(), '.env'),
    debug: process.env.DEBUG,
    allowEmptyValues: true
})

console.debug('process.env', process.env)


import * as puppeteer from 'puppeteer'
import checkLocalIncrement from './scripts/checkLocalIncrement'
import checkHomepageLoadsWithoutError from './scripts/checkHomepageLoadsWithoutError';
import incrementNumber from './scripts/incrementNumber';

const filterConsoleErrorNetworkInterrupts = (consoleErrors: Array<puppeteer.ConsoleMessage>) => {
    return consoleErrors.filter(
        (err) => err.text().indexOf('JSHandle@error') <= -1//ignore interrupted network requests due to page navigation
    )
}

const init = async () => {

    let browser
    try {


        browser = await puppeteer.launch({
            args: [
                '--start-fullscreen',
                //    "--disable-gpu",
                '--disable-setuid-sandbox',
                // "--force-device-scale-factor",
                '--ignore-certificate-errors',
                '--no-sandbox',
                '--auto-open-devtools-for-tabs',
                '--disable-gpu',
                // '--ignoreHTTPSErrors',
                // '--enable-features=NetworkService',
                // '--allow-running-insecure-content',
                // '--disable-web-security'
            ],
            // executablePath: await chrome.executablePath,
            headless: false,
            // dumpio:true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ? process.env.PUPPETEER_EXECUTABLE_PATH : undefined
        })

        //const page = await browser.targets()[browser.targets().length - 1].page()
        const page = await browser.newPage()

        await page.setRequestInterception(true)
        await page.setDefaultNavigationTimeout(10 * 1000)
        page.on('request', interceptedRequest => {
            console.debug('intercepted', interceptedRequest.url())
            interceptedRequest.continue()
            // if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
            //     interceptedRequest.abort();
            // else
            //     interceptedRequest.continue();
        });


        //monitor for console errors
        const firedConsoleErrors = []
        page.on('console', async msg => {
            if (msg.type() === "error") {
                firedConsoleErrors.push(msg as never)
            }
        })

        //accept all dialogs
        page.on('dialog', async dialog => {
            try {

                console.log('dialog message:', dialog.message())
                await dialog.accept()

            } catch (err) {
                // do nothing
            }
        })

        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        await page.emulate({
            viewport: {
                width: 375,
                height: 667,
                isMobile: true
            },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        })

        console.debug('Running scripts...')

        await checkHomepageLoadsWithoutError({ browser, page })

        await checkLocalIncrement({ browser, page })

        console.debug('Running scripts1...')
        await incrementNumber({ browser, page })
        console.debug('Running scripts2...')

        if (filterConsoleErrorNetworkInterrupts(firedConsoleErrors).length) {
            console.error('Console errors during login!', filterConsoleErrorNetworkInterrupts(firedConsoleErrors))
            //await page.waitFor(240*1000)

            throw new Error(`Console errors occurred!`)
        }

        browser.close()

        console.log('done')

    } catch (err) {
        console.error('err', err)
        browser.close()
    }




}

init()