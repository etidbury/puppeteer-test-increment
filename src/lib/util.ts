const axios = require('axios')
const querystring = require('querystring')

const {
    EDITABLE_ELEMENT_SELECTOR
    ,LOGIN_EMAIL_SELECTOR
    ,LOGIN_PASSWORD_SELECTOR
    ,GOOGLE_USERNAME
    ,GOOGLE_PASSWORD
    ,BOT_NAME
    ,MAX_LOG_ENTRY_TRANSPORT
    ,SLACK_POST_MESSAGE_WEBHOOK_URL
    ,STATUS_HEADER_TITLE
    ,GOOGLE_TOKEN_URL
    ,GOOGLE_CLIENT_ID
    ,GOOGLE_CLIENT_SECRET
    ,USER_REFRESH_TOKEN
    ,VIDEO_LIST_SPREADSHEET_ID
    ,GOOGLE_SPREADSHEET_API_KEY
} = require('../config')

let _logs = []
const logEndScreenAction = (msg,shouldForwardToSlack,forceForwardToSlack,onComplete)=>{
    const now = new Date()

    console.log(BOT_NAME,now,msg)

    if (!shouldForwardToSlack) return

    _logs.push(`${BOT_NAME} ${now.toString()} ${msg}`)

    if (_logs.length >= MAX_LOG_ENTRY_TRANSPORT || forceForwardToSlack){

        console.log(`Posting ${_logs.length} logs to Slack...`)

        axios.post(SLACK_POST_MESSAGE_WEBHOOK_URL,JSON.stringify(
            {
                text: _logs.join('\n')
            }
        ),{
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(()=>{
            console.log('Successfully posted logs to Slack')

            if (onComplete)
                onComplete()
            _logs = []
        }).catch(()=>{
            console.error('Failed to post logs to Slack')
            _logs = [] // warning: this results in logs being missing in Slack
            if (onComplete)
                onComplete()
        })
       
    }
}

const deleteEndCardElements = async (page)=>{
    let editableElements = await page.$$( EDITABLE_ELEMENT_SELECTOR)

    logEndScreenAction(`Delete Existing End Card elements: Found ${editableElements.length} end card elements`)
    // await page.keyboard.down('Shift')

    for (let i = 0; i < editableElements.length; i++) {
        logEndScreenAction(`Delete Existing End Card elements: Deleting ${i + 1}/${editableElements.length} element`)
        const editableElement = await page.$( EDITABLE_ELEMENT_SELECTOR)
        
        await editableElement.click()
        await page.keyboard.press('Backspace')
        await page.waitFor(2 * 1000)
        logEndScreenAction(`Delete Existing End Card elements: Deleted ${i + 1}/${editableElements.length} element`)
    }

    // await page.keyboard.up('Shift')
    // await page.keyboard.press('Backspace')
}

const moveEditableElement = async (page,editableElement,moveToX,moveToY)=>{

    const { x, y, width, height } = await editableElement.boundingBox()

    const selX = x + width / 2
    const selY = y + height / 2

    const selEndX = moveToX + width / 2
    const selEndY = moveToY + height / 2

    await page.mouse.move(selX, selY,{ steps: 10 })

    await page.mouse.down()

    // const moveToX = boundingBox.x+boundingBox.width
    await page.mouse.move(selEndX,selEndY,{ steps: 50 })
    await page.mouse.up()

    await page.waitFor(1 * 1000)
}

// todo: rename if redirect being removed
const loginViaGoogleAndRedirect = async (page,redirectTo)=>{

    // await takeScreenshotAndUploadToS3(page,'before-login')

    // await expect(page).toMatch('Login')

    // await page.click('.btn-login')

    // await page.waitFor(3*1000)

    // await page.waitFor(3*1000)
    // await page.waitForSelector(LOGIN_WITH_GOOGLE_BTN_SELECTOR)

    logEndScreenAction('Login: Waiting for email input')
    await page.waitForSelector(LOGIN_EMAIL_SELECTOR)
    
    await page.waitFor(1 * 1000)
    // await takeScreenshotAndUploadToS3(page,'auth0-login')

    await page.click(LOGIN_EMAIL_SELECTOR)
    // await page.waitFor(3*1000)
    await page.type(LOGIN_EMAIL_SELECTOR,GOOGLE_USERNAME)
    await page.waitFor(1 * 1000)
    await page.type(LOGIN_EMAIL_SELECTOR,String.fromCharCode(13))

    // let element = await page.$("body");
    // let text = await page.evaluate(el => el.textContent, element);
    logEndScreenAction('Login: Waiting for password input')
    await page.waitFor(10 * 1000)

    await page.waitForSelector(LOGIN_PASSWORD_SELECTOR)

    await page.click(LOGIN_PASSWORD_SELECTOR)
    
    await page.type(LOGIN_PASSWORD_SELECTOR,GOOGLE_PASSWORD)
    await page.waitFor(1 * 1000)

    await page.type(LOGIN_PASSWORD_SELECTOR,String.fromCharCode(13))
    logEndScreenAction('Login: Submitted login credentials')

    await page.waitFor(10 * 1000)

    // element = await page.$("body");
    // text = await page.evaluate(el => el.textContent, element);
    // console.log('inputpassword',text)
    // await page.waitFor(3*1000)

//    logEndScreenAction('Login: Redirect to target URL')

//     //todo: consider removing for faster processing
//     //ensure page redirects to location
//     await page.goto( redirectTo )

    // await takeScreenshotAndUploadToS3(page,'after-type-creds')
}

const generateEndScreenEditorURL = (youtubeVideoId)=>{
    return `https://www.youtube.com/endscreen?v=${youtubeVideoId}&ar=2&nv=1`
}

const addPageMarker = async (page,x,y,color)=>{

    logEndScreenAction(`Page Marker: Adding marker x:${x} y:${y} color:${color}`)

    await page.evaluate(({ x,y,color }) => {

        let dom = document.querySelector('body')
        dom.innerHTML += `<div style='background-color:${color}; position:absolute; top:${y}px; left:${x}px; width:10px; height:10px;' class='mymarker'></div>`

    },{ x,y,color })

    logEndScreenAction(`Page Marker: Marker added x:${x} y:${y} color:${color}`)
}

/**
 * Returns index with column that has {config.STATUS_HEADER_TITLE} as header
 */
const identifyStatusHeaderColumnIndex = async()=>{

    let { data: { values } } = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${VIDEO_LIST_SPREADSHEET_ID}/values/Sheet1?key=${GOOGLE_SPREADSHEET_API_KEY}`)
        .catch((err)=>{
            console.error('Failed to request from Google Spreadsheet API',err)
            throw err
        })

    const rowHeaders = values[0]

    const statusRowIndex = rowHeaders.indexOf(STATUS_HEADER_TITLE)

    if (statusRowIndex <= -1){
        throw new Error('Failed to find status header')
    }
    
    return statusRowIndex
}
/**
 * Returns letter with column that has {config.STATUS_HEADER_TITLE} as header
 */
const identifyStatusHeaderColumnLetter = async()=>{
    
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
   
    const statusRowIndex = await identifyStatusHeaderColumnIndex()
    
    return alphabet[statusRowIndex].toUpperCase()
}

let _lastTokenRefreshUnix = -1
let _lastAccessToken

const _refreshToken = async (refreshToken)=>{

    const diffAbs = Math.abs(new Date(_lastTokenRefreshUnix) - new Date())
    const diffMins = Math.floor((diffAbs / 1000) / 60)

    const MINS_UNTIL_REFRESH_ACCESS_TOKEN = 5

    if (diffMins < MINS_UNTIL_REFRESH_ACCESS_TOKEN && _lastAccessToken ) {
        console.log('Using old access token!')
        return { accessToken: _lastAccessToken }
    }
    
    const params = {
        client_id: GOOGLE_CLIENT_ID
        , client_secret: GOOGLE_CLIENT_SECRET
        , grant_type: 'refresh_token'
        , refresh_token: refreshToken
    }
    const p = querystring.stringify(params)

    const { accessToken } = await axios.post(GOOGLE_TOKEN_URL, p).then((r) => {
        // assert.typeOf(r.data, 'object', "Response is not an object");
        // assert.property(r.data, 'access_token',  "New access token not received.");
        if (r && r.data && r.data.access_token) {

            return { accessToken: r.data.access_token }

        } else throw new Error('Failed to find access token from response')

    }).catch((r)=>{
        console.error('response data: ',r && r.response && r.response.data)

        throw r
    })

    _lastAccessToken = accessToken
    _lastTokenRefreshUnix = Date.now()
    
    return { accessToken }
    
}

const writeStatusToSpreadsheet = async (youtubeVideoSpreadsheetIndex,statusColumnHeaderLetter,writeValue)=>{

    const { accessToken } = await _refreshToken(USER_REFRESH_TOKEN)

    const youtubeVideoRowNo = youtubeVideoSpreadsheetIndex + 1
    
    if (!writeValue || !writeValue.length)
        throw new TypeError('Invalid writeValue specified')

    let { data } = await axios.put(
        `https://sheets.googleapis.com/v4/spreadsheets/${VIDEO_LIST_SPREADSHEET_ID}/values/Sheet1!${statusColumnHeaderLetter}${youtubeVideoRowNo}:${statusColumnHeaderLetter}${youtubeVideoRowNo}?valueInputOption=USER_ENTERED`
        ,
        JSON.stringify({
            'range': `Sheet1!${statusColumnHeaderLetter}${youtubeVideoRowNo}:${statusColumnHeaderLetter}${youtubeVideoRowNo}`,
            'majorDimension': 'ROWS',
            'values': [
                [`${writeValue} [${new Date().toString()}]`]
            ],
        })
        ,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }
    )
        .catch((err)=>{
            console.error('Failed to request from Google Spreadsheet API')
            console.error('rrrr',err.response.data)
            throw err
        })

    return data
        
}

module.exports = {
    logEndScreenAction
    , deleteEndCardElements
    , moveEditableElement
    ,loginViaGoogleAndRedirect
    , generateEndScreenEditorURL
    , addPageMarker
    ,identifyStatusHeaderColumnIndex
    ,identifyStatusHeaderColumnLetter

    ,writeStatusToSpreadsheet
}