import {expect} from 'chai'
import { ScriptArgs } from '../types'

import {
    SELECTOR_BTN_LOCAL_TEST_NUMBER_INCREMENT
    ,SELECTOR_BTN_SERVER_TEST_NUMBER_INCREMENT
    ,SELECTOR_CONTAINER_LOCAL_TEST_NUMBER
    ,SELECTOR_CONTAINER_SERVER_TEST_NUMBER
} from '../config'

const {
    HOST,
    PORT,
    // GOOGLE_TEST_USERNAME,
    // GOOGLE_TEST_PASSWORD,
    // API_BASE_URL
} = process.env

// import {takeScreenshotAndUploadToS3} from '@etidbury/ts-next-helpers/util/test'

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || `http://${HOST}:${PORT}`

export default async ({browser,page}:ScriptArgs)=>{
    
    await page.goto( CLIENT_BASE_URL,{waitUntil:"networkidle2"} )
    
    await expect(page).to.include('Test number from server')

}