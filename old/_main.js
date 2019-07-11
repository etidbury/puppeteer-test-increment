const { identifyStatusHeaderColumnLetter } = require('./_util')

module.exports = async ()=>{

//     let {targetVideoIdList,endCardVideoId} = query

// targetVideoIdList=targetVideoIdList.split(',')

// if (targetVideoIdList.length<=0||targetVideoIdList.find((targetVideoId)=>!targetVideoId.length)) {
//     throw new Error('Invalid targetVideoIdList')
// }

    const { videoList }  = await require('./_get_video_list')()

    const start = Date.now()

    // }

    /* ---- select target video id list-----*/
    const {
        SELECT_VIDEO_LIST_FROM,
        SELECT_VIDEO_LIST_MAX
    } = process.env

    if ( SELECT_VIDEO_LIST_FROM <= -1 || isNaN(SELECT_VIDEO_LIST_FROM) ) throw new TypeError('Invalid env variable: SELECT_VIDEO_LIST_FROM')
    if ( SELECT_VIDEO_LIST_MAX <= 0 ) throw new TypeError('Invalid env variable: SELECT_VIDEO_LIST_MAX')

    // console.log('videolist',videoList.length)

    // const endIndex = videoList.length < SELECT_VIDEO_LIST_MAX+SELECT_VIDEO_LIST_FROM ? videoList.length : SELECT_VIDEO_LIST_MAX+SELECT_VIDEO_LIST_FROM
    const targetVideoList = videoList.splice(SELECT_VIDEO_LIST_FROM,SELECT_VIDEO_LIST_MAX)

    /* ----/select target video id list-----*/
    if (!targetVideoList || !targetVideoList.length) {
        throw new Error(`No target video list for selected range 
    (SELECT_VIDEO_LIST_FROM: ${SELECT_VIDEO_LIST_FROM} SELECT_VIDEO_LIST_MAX: ${SELECT_VIDEO_LIST_MAX})`)
    }

    const {
        END_CARD_LINK_URL
    } = process.env

    if ( !END_CARD_LINK_URL || !END_CARD_LINK_URL.length ) throw new TypeError('Invalid env variable: END_CARD_LINK_URL')

    const statusHeaderColumnLetter = await identifyStatusHeaderColumnLetter()
    
    await require('./endscreen')(targetVideoList,statusHeaderColumnLetter)

    const end = Date.now()

    const durationMs = end - start

    console.log('durationMs',durationMs)

}
