import { ScriptArgs } from '../types'

import {
    SELECTOR_BTN_LOCAL_TEST_NUMBER_INCREMENT
    ,SELECTOR_BTN_SERVER_TEST_NUMBER_INCREMENT
    ,SELECTOR_CONTAINER_LOCAL_TEST_NUMBER
    ,SELECTOR_CONTAINER_SERVER_TEST_NUMBER
    ,URL_HOMEPAGE
} from '../config'

const {
    HOST,
    PORT,
    // GOOGLE_TEST_USERNAME,
    // GOOGLE_TEST_PASSWORD,
    // API_BASE_URL
} = process.env

// import {takeScreenshotAndUploadToS3} from '@etidbury/ts-next-helpers/util/test'


export default async ({browser,page}:ScriptArgs)=>{
    
    await page.goto( URL_HOMEPAGE,{waitUntil:"networkidle2"} )
    
    if (!await page.evaluate(() => document.body.innerHTML.indexOf('Test number from server')>-1)){
        throw new Error('Failed to find text')
    }

}