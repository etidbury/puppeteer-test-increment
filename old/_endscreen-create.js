
// const LOGIN_SUBMIT_SELECTOR = 'input[type=submit]'
const {
    END_CARD_LINK_URL,
    EDITABLE_ELEMENT_SELECTOR
    ,INPUT_VIDEO_URL_SELECTOR
    ,LOGIN_EMAIL_SELECTOR
    ,LOGIN_PASSWORD_SELECTOR
    ,GOOGLE_USERNAME
    ,GOOGLE_PASSWORD
} = require('../config')

const { 
    logEndScreenAction
    , deleteEndCardElements
    , moveEditableElement
    ,loginViaGoogleAndRedirect
    , generateEndScreenEditorURL
} = require('./_util')

module.exports.createCards = async (page,{ videoURLCard = false,bestForViewerCard = false,subscribeCard = false })=>{

    let inputs
    let createBtns

    if (videoURLCard){

        // create specific video url end screen screen
        logEndScreenAction('Create Video URL End Card element: Processing...')
        await page.waitForSelector('#endscreen-editor-add-element')
        await page.click('#endscreen-editor-add-element')    
        await page.waitFor(2 * 1000)
        await page.waitForSelector('.annotator-create-button')
        await page.click('.annotator-create-button')
        await page.waitForSelector('#annotator-video-type-fixed')
        await page.click('#annotator-video-type-fixed')
        await page.waitForSelector('#annotator-video-type-fixed')
        await page.click('#annotator-video-type-fixed')
        await page.waitFor(2 * 1000)
        inputs = await page.$$( INPUT_VIDEO_URL_SELECTOR)
        await inputs[1].type(`${END_CARD_LINK_URL}`)
        await inputs[1].type(String.fromCharCode(13))
        logEndScreenAction('Create Video URL End Card element: Complete')
        
        await page.waitFor(5 * 1000)
    }

    if (bestForViewerCard){

        // create auto suggested video card (best for viewer)
        logEndScreenAction('Create Auto Suggested Video End Card element: Processing...')
        await page.waitForSelector('#endscreen-editor-add-element')
        await page.click('#endscreen-editor-add-element')    
        await page.waitFor(5 * 1000)
        createBtns = await page.$$( '.annotator-create-button' )
        await createBtns[0].click()// select video button
        await page.waitForSelector('#annotator-video-type-best-for-viewer')
        await page.click('#annotator-video-type-best-for-viewer')
        await page.waitFor(2 * 1000)
        //  inputs = await page.$$( INPUT_VIDEO_URL_SELECTOR)
        //  await inputs[1].type('https://www.youtube.com/watch?v=Fd-Skvr9xRE')
        await inputs[1].type(String.fromCharCode(13))
        logEndScreenAction('Create Auto Suggested Video End Card element: Complete')

        await page.waitFor(5 * 1000)
    }

    // create a subscription card
    if (subscribeCard) {

        logEndScreenAction('Create Subscribe End Card element: Processing...')
        await page.waitForSelector('#endscreen-editor-add-element')
        await page.click('#endscreen-editor-add-element')    
        await page.waitFor(5 * 1000)
        createBtns = await page.$$( '.annotator-create-button' )
        
        await createBtns[1].click()// select subscribe button
        // await page.waitForSelector('#annotator-video-type-best-for-viewer')
        // await page.click('#annotator-video-type-best-for-viewer')
        await page.waitFor(2 * 1000)
        //  inputs = await page.$$( INPUT_VIDEO_URL_SELECTOR)
        //  await inputs[1].type('https://www.youtube.com/watch?v=Fd-Skvr9xRE')
        await inputs[1].type(String.fromCharCode(13))
        logEndScreenAction('Create Subscribe End Card element: Complete')
    }

}