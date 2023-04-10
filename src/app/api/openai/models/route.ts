import {SupportModels} from "@/common/server/CommonUtils";

export async function GET(request: Request) {
    const params = new URLSearchParams(new URL(request.url).searchParams)
    const type = params?.get('type') || ''
    const models = []
    if(type === 'chat'){
        models.push(...SupportModels.chat)
    } else if(type === 'completion'){
        models.push(...SupportModels.completion)
    }
    return new Response(JSON.stringify(models))

}
