'use client' //i have no idea what this does, but the code doesn't work without it.

import { useState } from 'react';
import { useEffect } from 'react';

function Cell({ rgba, penColor, onCellInteract }){
    //return a div with a fill rule set to the rgba prop. also add a hover rule that changes the border color to be
    return(
        <> 
            <div className="cell"  onMouseUp={ (e) => onCellInteract('mouseup', e) } onMouseDown={ (e) => { e.preventDefault(); onCellInteract('mousedown', e) } } onMouseEnter={ (e) => onCellInteract('mouseenter', e) } onContextMenu={ (e) => e.preventDefault() }></div>
            <style jsx>{`
                .cell{
                    width: 25px;
                    height: 25px;
                    background-color: ${rgba};
                    border: 1px solid black;
                }
                .cell:hover{
                    border: 2px solid ${penColor};
                }
            `}</style>
        </>
    )
}

function Canvas({ /* penColor, bordersEnabled */ }){
    //create a state array with 24 nested arrays. each nested array is filled with 24 starting rgba value strings.
    // canvasData = [..., row[..., 'rgba']]
    const [canvasData, setCanvasData] = useState(new Array(24).fill(new Array(24).fill('rgba(255, 50, 0, 255)')))
    const [history, setHistory] = useState([])
    const [mouseDown, setMouseDown] = useState(false)
    const [isErasing, setIsErasing] = useState(false)
    const [shiftKeyDown, setShiftKeyDown] = useState(false)
    const penColor = 'rgba(0, 255, 0, 255)'

    useEffect(() => {       
        /**
         * This code is wrapped in a useEffect function
         * because it references the 'window' DOM object.
         * Since components are compiled serverside, browser-only
         * code will throw errors unless it is wrapped in this useEffect block.
         */
        window.addEventListener('keydown', (e) => { 
            if (e.key == 'Shift') setShiftKeyDown(true)
        })
        window.addEventListener('keyup', (e) => { 
            if (e.key == 'Shift') setShiftKeyDown(false)
        })
    }, []);

    function handleInteract(row, col, type, e) {
        let color = penColor

        if (isErasing == true || e.button == 2) color = 'rgba(0,0,0,0)'
        if (shiftKeyDown && mouseDown) color = 'rgba(0,0,0,0)'
        if (shiftKeyDown && type == 'mousedown') color = 'rgba(0,0,0,0)'

        /**
         * Canvas drawing logic. This shit is so stupid.
         * 
         * If a user holds left click off of the canvas and drags onto canvas, do not draw
         * If a user holds left click on the canvas and drags, allow draw
         * If a user holds left click on the canvas, leaves the canvas, and then re-enters without letting go of left click, allow draw
         * 
         * Same rules apply to right click, except for right click will erase cells.
         * Same rules apply to shift + left click, except that will also erase cells.
         */

        switch (type){
            case 'mousedown':
                setMouseDown(true)
                break
            case 'mouseup':
                setMouseDown(false)
                setIsErasing(false)
                return
                break
            case 'mouseenter':
                if (!mouseDown) return
                break
        }

        if (e.button == 2){
            setIsErasing(true)
        }

        /** 
         * This next line (const nextCanvasData = [...]) is super dense. Here's a step-by-step breakdown of what it does:
         * 
         * 1. List all nested arrays before target row
         * 2. Insert a new nested array
         * 3. In new nested array, list all rgba values before target col
         * 4. In new nested array, push new penColor rgba value
         * 5. In new nested array, list remaining rgba values, if any, after target col
         * 6. List all remaining nested arrays, if any, after target row
        */
        const nextCanvasData = [...canvasData.slice(0, row), [...canvasData[row].slice(0, col), color, ...canvasData[row].slice(col + 1)], ...canvasData.slice(row + 1)]
        setHistory([...history, canvasData])
        setCanvasData(nextCanvasData)
    }

    //This return statement is a fuckin doozy and I will explain how it works later.
    return(
        canvasData.map((rowArr, rowIndex) => {
            return(
                <div key={ rowIndex }>
                    <div className='row'>{
                        rowArr.map((rgba, colIndex) => {
                            return(
                                <Cell rgba={ rgba } penColor={ penColor } onCellInteract={ (type, e) => handleInteract(rowIndex, colIndex, type, e) } key={ colIndex } />
                            )
                        })
                    }</div>
                    <style jsx>{`
                        .row{
                            display: flex;
                        }
                    `}</style>
                </div>
            )
        })
    )
}

function Editor(){
    return(
        <div className='canvas'>
            <Canvas />
        </div>
    )
}

export default function Page(){
    return(
        <>  
            <Editor />
        </>
    )
}