const {
    REPEAT_VIDEO_ENTRIES
} = require('../config')

const axios = require('axios')

const {
    NODE_ENV
} = process.env

const { identifyStatusHeaderColumnIndex } = require('./_util')

const isTest = (NODE_ENV === 'test' || NODE_ENV === 'testing')

module.exports = async ()=>{

    try {

        // todo: move!!
        const { 
            VIDEO_LIST_SPREADSHEET_ID,
            GOOGLE_SPREADSHEET_API_KEY
        } = process.env
        
        let { data: { values } } = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${VIDEO_LIST_SPREADSHEET_ID}/values/Sheet1?key=${GOOGLE_SPREADSHEET_API_KEY}`)
            .catch((err)=>{
                console.error('Failed to request from Google Spreadsheet API')
                throw err
            })

        values = values.map((value,idx)=>{
            return Object.assign(value,{ spreadsheetRowIndex: idx })
        })

        values.shift() // remove column headers
        
        values = values.filter((value)=>value[0] && value[0].length > 2)

        if (isTest) {
            console.log('> TEST MODE: Using test video list')
            values = require('./test-video-list')
        }

        const statusRowIndex = await identifyStatusHeaderColumnIndex()

        if (process.env.FILTER_ONLY_FAILED){
           
            // console.log('filter',statusRowIndex,values[2][statusRowIndex])
            values = values.filter((value)=>{
                return value[statusRowIndex] && value[statusRowIndex].indexOf('FAILED') > -1
            })

        }
        
        let videoList = values.map((value,idx)=>({
            targetVideoId: value[0],
            videoName: value[1],
            spreadsheetRowIndex: value['spreadsheetRowIndex'],
            status: value[statusRowIndex]
        }))
       
        if (REPEAT_VIDEO_ENTRIES && REPEAT_VIDEO_ENTRIES > 0){
            console.log('Repeating entries',REPEAT_VIDEO_ENTRIES)
            for (let i = 0;i < REPEAT_VIDEO_ENTRIES - 1;i++) {
                videoList = videoList.concat(videoList)
            }
    
        }
        
        return {
            videoList
        }

    }catch(err){
        console.error('Failed to obtain video list')
        console.error(err)
    }

}