import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import {createRef, useEffect, useState} from "react";

interface Live2DProps {
    width?: number;
    height?: number;
    model: string;
}
export const Live2D = ({width, height, model}: Live2DProps) => {
    const canvas = createRef<HTMLCanvasElement>()
    const [app, setApp] = useState<PIXI.Application>()

    useEffect(() => {
        if(!window) return;
        (window as any).PIXI = PIXI;
        const app = new PIXI.Application({
            view: canvas.current || undefined,
            autoStart: true,
            resizeTo: canvas.current || undefined,
            backgroundAlpha: 0,
            width: width || 500,
            height: height || 500,
        })
        Live2DModel.from(`live2d/models/${model}`).then((live2dModel) => {
            // @ts-ignore
            app.stage.addChild(live2dModel);
            // live2dModel.x = 100
            live2dModel.y = app.screen.height * 0.1
            live2dModel.rotation = Math.PI
            live2dModel.skew.x = Math.PI
            const scale = live2dModel.width / live2dModel.height > app.screen.width / app.screen.height ?
                app.screen.width / live2dModel.width : app.screen.height / live2dModel.height
            live2dModel.scale.set(scale)
            live2dModel.anchor.set(0.5, 0.5)
            live2dModel.position.set(app.screen.width / 2, app.screen.height / 2)

            live2dModel.on('hit', (hitAreas) => {
                if (hitAreas.includes('body')) {
                    live2dModel.motion('tap_body');
                }
            });


            // // print pointer position when pointer moves
            // live2dModel.on('pointermove', (e) => {
            //     console.log("focus " + e.data.global.x + " " + (e.data.global.y + 200));
            //     live2dModel.focus(e.data.global.x, e.data.global.y - 2000);
            // });
        })
    }, [canvas, model, width, height])

    return (
        <div>
            <canvas ref={canvas}></canvas>
        </div>
    )
}