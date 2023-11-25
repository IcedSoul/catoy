import dynamic from 'next/dynamic'
import Script from "next/script";
const Live2D = dynamic(() => import('@/components/live2d/Live2D').then((mod) => mod.Live2D), { ssr: false })


export const ApplicationMain = () => {
    return (
        <div>
            <Script src="/live2d/js/live2dcubismcore.js"/>
            <Script src="/live2d/js/live2d.min.js"/>
            <Live2D width={1000} height={1200} model="星野爱/星野爱.model3.json"/>
        </div>
    )
}