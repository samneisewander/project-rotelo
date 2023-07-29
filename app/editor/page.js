'use client'

import { Canvas } from '@/modules/editor.js'
import { HexColorPicker } from "react-colorful";
import { useState } from 'react'

function Editor(){
    const [penColor, setPenColor] = useState('rgba(0,0,0,255)')

    return(
        <>
            <div className='canvas' style={{ width: 'fit-content', border: '1px solid black'}}>
                <Canvas penColor={ penColor }/>
            </div>
            <div>
                <HexColorPicker color={ penColor } onChange={ (color) => setPenColor(color) }/>
            </div>
        </>
    )
}

export default function Page(){
    return(
        <>  
            <Editor />
        </>
    )
}