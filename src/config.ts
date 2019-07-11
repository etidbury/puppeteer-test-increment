const EDITABLE_ELEMENT_SELECTOR = '.editable-element'
const INPUT_VIDEO_URL_SELECTOR = 'input[name=\'video_url\']'
const LOGIN_EMAIL_SELECTOR = 'input[type=email]'
const LOGIN_PASSWORD_SELECTOR = 'input[type=password]'
const SLACK_POST_MESSAGE_WEBHOOK_URL = 'https://hooks.slack.com/services/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'

const MAX_LOG_ENTRY_TRANSPORT = 20

const GOOGLE_USERNAME = process.env.GOOGLE_USERNAME
const GOOGLE_PASSWORD =  process.env.GOOGLE_PASSWORD
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET =  process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_SPREADSHEET_API_KEY =  process.env.GOOGLE_SPREADSHEET_API_KEY
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v3/token'

const VIDEO_LIST_SPREADSHEET_ID = process.env.VIDEO_LIST_SPREADSHEET_ID

const BTN_SAVE_SELECTOR = '#endscreen-editor-save'

const ENDCARD_SAFE_AREA_SELECTOR = '.playergrid-safe-area'

const MIN_ENDCARD_SAFEAREA_WIDTH = 390
/**
 * Whether to repeat list of video entries. 
 * (e.g. video list is 100, REPEAT_VIDEO_ENTRIES = 5 means video list will be 500)
 * 
 * Set to zero will not repeat video list
 */
const REPEAT_VIDEO_ENTRIES = process.env.REPEAT_VIDEO_ENTRIES

// todo: add docs
const VIDEO_LIST_CHUNK_SIZE = 10

if (!GOOGLE_USERNAME || !GOOGLE_USERNAME.length){
    throw new TypeError('GOOGLE_USERNAME invalid')
}

if (!GOOGLE_PASSWORD || !GOOGLE_PASSWORD.length){
    throw new TypeError('GOOGLE_PASSWORD invalid')
}

const BOT_NAME = process.env.BOT_NAME

if ( !BOT_NAME || !BOT_NAME.length ) throw new TypeError('Invalid env variable: BOT_NAME')

const {
    END_CARD_LINK_URL
} = process.env

if ( !END_CARD_LINK_URL || !END_CARD_LINK_URL.length ) throw new TypeError('Invalid env variable: END_CARD_LINK_URL')

const STATUS_HEADER_TITLE = 'status'

const USER_REFRESH_TOKEN = '1/tEkXAOqI0q_pTmzf9bLJlpwjHKlBVp7-D9FoXJ6HmuZsCuoj5r1HodoQG_ehrh4s'

module.exports = {
    EDITABLE_ELEMENT_SELECTOR
    ,INPUT_VIDEO_URL_SELECTOR
    ,LOGIN_EMAIL_SELECTOR
    ,LOGIN_PASSWORD_SELECTOR
    ,GOOGLE_USERNAME
    ,GOOGLE_PASSWORD
    ,END_CARD_LINK_URL
    ,BTN_SAVE_SELECTOR
    ,BOT_NAME
    ,MAX_LOG_ENTRY_TRANSPORT
    ,SLACK_POST_MESSAGE_WEBHOOK_URL
    ,REPEAT_VIDEO_ENTRIES
    ,VIDEO_LIST_CHUNK_SIZE
    ,ENDCARD_SAFE_AREA_SELECTOR
    ,MIN_ENDCARD_SAFEAREA_WIDTH
    ,STATUS_HEADER_TITLE
    ,USER_REFRESH_TOKEN
    ,GOOGLE_CLIENT_ID
    ,GOOGLE_CLIENT_SECRET
    ,GOOGLE_SPREADSHEET_API_KEY
    ,VIDEO_LIST_SPREADSHEET_ID
    ,GOOGLE_TOKEN_URL 
}