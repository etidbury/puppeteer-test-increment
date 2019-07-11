
// const LOGIN_SUBMIT_SELECTOR = 'input[type=submit]'
import {
    EDITABLE_ELEMENT_SELECTOR
    ,INPUT_VIDEO_URL_SELECTOR
    ,LOGIN_EMAIL_SELECTOR
    ,LOGIN_PASSWORD_SELECTOR
    ,GOOGLE_USERNAME
    ,GOOGLE_PASSWORD
    ,BTN_SAVE_SELECTOR
    ,VIDEO_LIST_CHUNK_SIZE
    ,ENDCARD_SAFE_AREA_SELECTOR
    ,MIN_ENDCARD_SAFEAREA_WIDTH
} from './config'

import { 
    logEndScreenAction
    , deleteEndCardElements
    , moveEditableElement
    ,loginViaGoogleAndRedirect
    , generateEndScreenEditorURL
    ,addPageMarker
    ,writeStatusToSpreadsheet
} from './lib/'

const { chunk } = require('lodash')

const {
    IS_PI
} = process.env

const isPi = IS_PI

// if (isPi) {

//     browser = await puppeteerCore.launch({
//         args: chrome.args,
//         executablePath: await chrome.executablePath,
//         headless: chrome.headless,
//     })
    
// }else {
    
const puppeteer = require('puppeteer')
    
const piArgs = [
    //  '--start-fullscreen',
    //    "--disable-gpu",
    '--disable-setuid-sandbox',
    // "--force-device-scale-factor",
    '--ignore-certificate-errors',
    '--no-sandbox',
]

const updateStatusOrFailSilently = async (statusHeaderColumnLetter,spreadsheetRowIndex,statusValue)=>{

    try {
    
        // console.log('spreadsheetRowIndex',spreadsheetRowIndex)

        // console.log('videoList',videoList)
    
        logEndScreenAction(`Updating status of video no. ${spreadsheetRowIndex + 1} to ${statusValue} on spreadsheet`)
        
        const d = await writeStatusToSpreadsheet(spreadsheetRowIndex,statusHeaderColumnLetter,statusValue)

    }catch(err){
        console.error(err)
        
        logEndScreenAction('Failed to update status to spreadsheet')
        // silent

    }

}
module.exports = async (targetVideoList,statusHeaderColumnLetter)=>{

    const targetVideoListChunks = chunk(targetVideoList,VIDEO_LIST_CHUNK_SIZE)

    for (let x = 0; x < targetVideoListChunks.length; x++) {

        const processChunkStartTs = Date.now()

        logEndScreenAction(`Processing video list chunk ${x}/${targetVideoListChunks.length} (Chunk size: ${VIDEO_LIST_CHUNK_SIZE})`,true)
        
        const browser = await puppeteer.launch({
            args: isPi ? piArgs : undefined,
            // executablePath: await chrome.executablePath,
            headless: false,
            // dumpio:true,
            executablePath: isPi ? '/usr/bin/chromium-browser' : undefined
        })
        
        logEndScreenAction('Browser launched')

        const targetVideoListChunk = targetVideoListChunks[x]

        const page = await browser.newPage()

        logEndScreenAction('Browser page launched')
    
        page.on('dialog', async dialog => {
            try {
    
                console.log('dialog message:',dialog.message())
                await dialog.accept()
    
            }catch(err){
                // do nothing
            }
        })

        const firstYoutubeVideoId = targetVideoListChunk[0].targetVideoId
    
        const homepage = generateEndScreenEditorURL(firstYoutubeVideoId)
        // const homepage="https://www.youtube.com/dashboard?o=YbGWGCIUCoaUePqGy_acMw"
      
        await page.setDefaultNavigationTimeout(60 * 1000) 
        await page.setViewport({ width: 1282, height: 701 })
    
        logEndScreenAction('Browser page configured')
        // await page.setRequestInterception(true)
    
        // page.on('request', interceptedRequest => {
        //     const url = interceptedRequest.url()
           
        //     if (url.indexOf('ajax')>-1){
        //         console.log('url',url)
        //     }
            
        //     interceptedRequest.continue()
        //     // if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
        //     //     interceptedRequest.abort()
        //     // else
        //     //     interceptedRequest.continue()
        // })
    
        await page.goto( homepage )

        // await page.waitForNavigation()
        await page.waitFor(5 * 1000)

        logEndScreenAction('Navigated to login')

        logEndScreenAction('Logging in...',true)
        
        await loginViaGoogleAndRedirect(page,homepage)

        logEndScreenAction('Login complete',true)
    
        // await new Promise((r)=>setTimeout(r,6000))
        // await page.waitForSelector(LOGIN_WITH_GOOGLE_BTN_SELECTOR)
    
        // await page.click(LOGIN_WITH_GOOGLE_BTN_SELECTOR)
        // await page.click('.auth0-lock-submit')
    
        // await takeScreenshotAndUploadToS3(page,'just-after-login')
    
        // await page.waitFor(6000)
    
        // if (filterConsoleErrorNetworkInterrupts(noConsoleErrors).length) {
    
        //     console.error('Console errors during login!',filterConsoleErrorNetworkInterrupts(noConsoleErrors))
    
        //     // await page.waitFor(240*1000)
            
        //     // await page.waitFor(240*1000)
    
        //     // 2 currently theshold due to auth0 sending error response for missing avatar
        //     if (filterConsoleErrorNetworkInterrupts(noConsoleErrors).length>2){
        //         throw new Error(`Unexpected onsole errors occurred during login!`)
        //     }
    
        // }
        
        for (let i = 0; i < targetVideoListChunk.length;i++) {
            
            const { targetVideoId,spreadsheetRowIndex } = targetVideoListChunk[i]

            // async
            updateStatusOrFailSilently(statusHeaderColumnLetter,spreadsheetRowIndex,'PROCESSING')
           
            try {
    
                const processVideoStartTs = Date.now()
                const logActionLabel = `(${i + 1}/${targetVideoListChunk.length})`
                
                logEndScreenAction(`Processing video ID ${targetVideoId} ${logActionLabel}`,true)
    
                const editorURL = generateEndScreenEditorURL(targetVideoId)
    
                await page.goto( editorURL )
                // await page.waitFor(2*1000)
                // await page.type(String.fromCharCode(13))
    
                await page.waitFor(5 * 1000)
                
                const element = await page.$('body')
                const text = await page.evaluate(element => element.textContent, element)
    
                // console.log('editor text content!!',text)
    
                if (text.indexOf('end screen') <= -1){
                    throw new Error('Failed to login')
                }

                // opjozfqwmodqquuv

                const playerGridSafeArea = await page.$(ENDCARD_SAFE_AREA_SELECTOR)

                const endScreenSafeArea = await playerGridSafeArea.boundingBox()

                logEndScreenAction(`End screen safe area width:${endScreenSafeArea.width} for video ${targetVideoId}`)
                
                if (endScreenSafeArea.width < MIN_ENDCARD_SAFEAREA_WIDTH) {
                    
                    logEndScreenAction(`End screen safe area not wide enough (min:${MIN_ENDCARD_SAFEAREA_WIDTH})for video ${targetVideoId}`,true)
                    throw new Error('End screen safe area not wide enough')
                    
                }

                // const isSmallScreen = endScreenSafeArea.height<230 //todo: determine this with end card safe zone height
    
                // logEndScreenAction(`End Card safe area height: ${endScreenSafeArea.height} for video ${targetVideoId}`)
            
                // if (isSmallScreen) {
                //     logEndScreenAction(`Small screen detected ${targetVideoId}`,true)
                // }else{
                //     logEndScreenAction(`Large screen detected ${targetVideoId}`,true)
                // }
            
                // await addPageMarker(page,300,300,'green') //todo: test add page marker
            
                /* --------*/
    
                await deleteEndCardElements(page)
    
                /* --------*/
                await page.waitFor(2 * 1000)
    
                await require('./_endscreen-create').createCards(page,{ subscribeCard: true,videoURLCard: true,bestForViewerCard: true })
    
                //     console.log('example',inputs)
                //     console.log('example2',inputs.length)
    
                //     await page.waitForSelector(INPUT_VIDEO_URL_SELECTOR)
                //    // await page.click(INPUT_VIDEO_URL_SELECTOR)
                //     await inputs[1].type(INPUT_VIDEO_URL_SELECTOR,'https://www.youtube.com/watch?v=Fd-Skvr9xRE')
    
                await page.waitFor(5 * 1000)
    
                logEndScreenAction(`Attempt creating layout 1 for video ${targetVideoId}`)
                await require('./_endscreen-layout').layout1(page)

                // await require('./_endscreen-layout').layout1(page)
    
                // if (isSmallScreen) {
                //     await require('./_endscreen-layout').layout2(page)
                // }else{
                //     await require('./_endscreen-layout').layout1(page)
                // }
            
                //     await page.mouse.move(selX, selY,{steps:10});
    
                //     await page.mouse.down()
    
                // // const moveToX = boundingBox.x+boundingBox.width
                //     await page.mouse.move(moveToX,selY+50,{steps:50});
                //     await page.mouse.up()
    
                /* ----- /scale best for viewer card-------*/
    
                await page.waitFor(5 * 1000)
    
                const saveBtnElement = await page.$(BTN_SAVE_SELECTOR)
    
                // const isSaveBtnDisabled = await page.evaluate(
                //     (saveBtnElement) => {
                //         return saveBtnElement.hasAttribute('disabled')
                //     }
                // ,saveBtnElement)

                const isSaveBtnDisabledFromLayout1 = await page.evaluate(
                    (saveBtnElement) => {
                        return saveBtnElement.hasAttribute('disabled')
                    }
                    ,saveBtnElement)

                let _usedLayout2 = false
                if (isSaveBtnDisabledFromLayout1) {
                // reset and create layout 2
                    logEndScreenAction(`Save disabled. Attempt creating layout 2 for video ${targetVideoId}`)
                    await deleteEndCardElements(page)
         
                    await page.waitFor(2 * 1000)
        
                    await require('./_endscreen-create').createCards(page,{ subscribeCard: false,videoURLCard: true,bestForViewerCard: true })
                
                    await page.waitFor(5 * 1000)
        
                    await require('./_endscreen-layout').layout2(page)

                    _usedLayout2 = true
                }

                await page.waitFor(1 * 1000)

                const isSaveBtnDisabledFromAllLayouts = await page.evaluate(
                    (saveBtnElement) => {
                        return saveBtnElement.hasAttribute('disabled')
                    }
                    ,saveBtnElement)

                if (isSaveBtnDisabledFromAllLayouts){
                    logEndScreenAction('Save button still disabled')
                    throw new Error(`Failed to create a layout suitable for video ${targetVideoId}`)
                }

                logEndScreenAction('Clicking save')
    
                await page.click(BTN_SAVE_SELECTOR)
                
                const processVideoEndTs = Date.now()
                
                const processVideoDurationMs = processVideoEndTs - processVideoStartTs
    
                // async
                updateStatusOrFailSilently(statusHeaderColumnLetter,spreadsheetRowIndex,`L${_usedLayout2 ? '2' : '1'} COMPLETE`)
                
                logEndScreenAction(`Complete processing video ID ${targetVideoId} ${logActionLabel} (Duration ~${processVideoDurationMs}ms)`,true)
    
                await page.waitFor(5 * 1000)
                
            }catch (err){
                console.error(err)
    
                // try {
                
                //     if (!_hasLoggedPageText){
    
                //         const element = await page.$("body");
                //         const text = await page.evaluate(element => element.textContent, element);
                //         console.log('Page Text:',text)
                //         _hasLoggedPageText=true
                //     }
                // }catch(er){
                //     //suppress
                // }
    
                // async
                updateStatusOrFailSilently(statusHeaderColumnLetter,spreadsheetRowIndex,'FAILED')
                 
                logEndScreenAction(`Failed processing video ID ${targetVideoId}`,true)
                await page.waitFor(5 * 1000)
            }
        }// endfor targetVideoList
        
        const processChunkEndTs = Date.now()

        const processChunkDurationMs = processChunkEndTs - processChunkStartTs

        logEndScreenAction(`Finished processing video list chunk ${x}/${targetVideoListChunks.length} (Duration ~${processChunkDurationMs}ms)`,true)

        browser.close()

    }// endfor targetVideoListChunks

}