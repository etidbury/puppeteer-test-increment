const {
    EDITABLE_ELEMENT_SELECTOR
    ,ENDCARD_SAFE_AREA_SELECTOR
} = require('../config')

const { 
    logEndScreenAction
    , deleteEndCardElements
    , moveEditableElement
    ,loginViaGoogleAndRedirect
    , generateEndScreenEditorURL
    , addPageMarker
} = require('./_util')

module.exports.layout1 = async (page)=>{

    const editableElements = await page.$$( EDITABLE_ELEMENT_SELECTOR)
    const playerGridSafeArea = await page.$('.playergrid-safe-area')

    const endScreenSafeArea = await playerGridSafeArea.boundingBox()

    logEndScreenAction('Move End Card elements: Processing layout 1...')

    for (let i = 0; i < editableElements.length; i++){
        
        const { x, y, width, height } = await editableElements[i].boundingBox()
        
        // const moveToX = endScreenSafeArea.x+endScreenSafeArea.width

        let moveToX = 0
        let moveToY = 0

        switch(i){
        case 0: // sub button
            moveToX = endScreenSafeArea.x
            moveToY = endScreenSafeArea.y + 10
            break
            case 1: // best for viewer
            moveToX = endScreenSafeArea.x
            moveToY = endScreenSafeArea.y + endScreenSafeArea.height - height - 10
            break
            case 2: // custom link
            moveToX = endScreenSafeArea.x + endScreenSafeArea.width - width - 10
            moveToY = endScreenSafeArea.y + (endScreenSafeArea.height / 2 - height / 2)
            break
            default:
            throw new Error(`Move coordinates not set for editable element ${i}`)
            break
        }

        // console.log('move element',i,{moveToX,moveToY})

        logEndScreenAction(`Move End Card elements: Moving ${i + 1}/${editableElements.length} element to 
        x:${moveToX}, y:${moveToY} - end screen safe area: x:${endScreenSafeArea.x} y:${endScreenSafeArea.y} 
        w:${endScreenSafeArea.width} h:${endScreenSafeArea.height}`)
        
        await moveEditableElement(page,editableElements[0],moveToX,moveToY)

        logEndScreenAction(`Move End Card elements: Move ${i + 1}/${editableElements.length} element complete`)

    }

    // }//end if false //todo: remove if
    
    // const playerGridSafeArea = await page.$('.playergrid-safe-area')
    // const endScreenSafeArea = await playerGridSafeArea.boundingBox()

    /* ------scale best for viewer card-------*/
    const elementTopRightDraggers = await page.$$('.editable-element-dragger.top-right')

    const bestForViewerCardTopRightDragger = elementTopRightDraggers[1]

    // editable-element-dragger top-right
    logEndScreenAction('Resizing Best For Viewer End Card')
    
    // const editableElements = await page.$$( EDITABLE_ELEMENT_SELECTOR)
    const { height: subscribeEndCardHeight,width: subscribeEndCardWidth } = await editableElements[0].boundingBox()
    const scaleToX = endScreenSafeArea.x + 5
    const scaleToY = endScreenSafeArea.y + subscribeEndCardHeight + 5
    // document.querySelectorAll('.editable-element-dragger.top-right')
    await moveEditableElement(page,bestForViewerCardTopRightDragger,scaleToX,scaleToY)

    await page.waitFor(2000)

    await editableElements[1].click()
    
    logEndScreenAction('Completed resize Best For Viewer End Card')

}

/**
 * Position 'Best For Viewer' and 'Cusotm Link' end card elements for small videos
 */
module.exports.layout2 = async (page)=>{

    const editableElements = await page.$$( EDITABLE_ELEMENT_SELECTOR)
    const playerGridSafeArea = await page.$(ENDCARD_SAFE_AREA_SELECTOR)

    const endScreenSafeArea = await playerGridSafeArea.boundingBox()

    logEndScreenAction('Move End Card elements: Processing layout 2...')

    for (let i = 0; i < editableElements.length; i++){

        const { x, y, width, height } = await editableElements[i].boundingBox()
        
        // const moveToX = endScreenSafeArea.x+endScreenSafeArea.width
        
        let moveToX = 0
        let moveToY = 0

        switch(i) {
        // case 0: //sub button
        //     moveToX = endScreenSafeArea.x + 1
        //     //moveToY=endScreenSafeArea.y+10
        //     moveToY = endScreenSafeArea.y + (endScreenSafeArea.height/2 - height/2)
        // break;
        case 0: // custom video url

            moveToX = endScreenSafeArea.x + endScreenSafeArea.width - width - 10 // 544-245-10
            moveToY = endScreenSafeArea.y + (endScreenSafeArea.height / 2 - height / 2)
               
            break
            case 1: // best for viewer
            moveToX = endScreenSafeArea.x + 10
            moveToY = endScreenSafeArea.y + (endScreenSafeArea.height / 2 - height / 2)
            // await addPageMarker(page,moveToX,moveToY,'red')
            break
            default:
            throw new Error(`Move coordinates not set for editable element ${i}`)
            break
        }

        // console.log('move element',i,{moveToX,moveToY})

        logEndScreenAction(`Move End Card elements: Moving ${i + 1}/${editableElements.length} element to 
        x:${moveToX}, y:${moveToY} - end screen safe area: x:${endScreenSafeArea.x} y:${endScreenSafeArea.y} 
        w:${endScreenSafeArea.width} h:${endScreenSafeArea.height}`)
        
        logEndScreenAction(`Card details: w:${width} h:${height}`)

        // set to 0 because index changes when selecting editable elements
        await moveEditableElement(page,editableElements[0],moveToX,moveToY)
        
        logEndScreenAction(`Move End Card elements: Move ${i + 1}/${editableElements.length} element complete`)

    }

// }//end if false //todo: remove if
    
    // const playerGridSafeArea = await page.$('.playergrid-safe-area')
    // const endScreenSafeArea = await playerGridSafeArea.boundingBox()

    /* ------scale best for viewer card-------*/
    // const elementTopRightDraggers = await page.$$('.editable-element-dragger.top-right')

    // const bestForViewerCardTopRightDragger = elementTopRightDraggers[1]

    // // editable-element-dragger top-right
    // logEndScreenAction(`Resizing Best For Viewer End Card`)
    
    // //const editableElements = await page.$$( EDITABLE_ELEMENT_SELECTOR)
    // const { height: subscribeEndCardHeight,width:subscribeEndCardWidth } = await editableElements[0].boundingBox()
    // const scaleToX = endScreenSafeArea.x+5
    // const scaleToY = endScreenSafeArea.y+subscribeEndCardHeight+5
    // //document.querySelectorAll('.editable-element-dragger.top-right')
    // await moveEditableElement(page,bestForViewerCardTopRightDragger,scaleToX,scaleToY)

    // await page.waitFor(2000)

    // await editableElements[1].click()
    
    // logEndScreenAction(`Completed resize Best For Viewer End Card`)

}