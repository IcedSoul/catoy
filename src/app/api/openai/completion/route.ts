import {ChatMessage, SessionUser} from "@/common/client/ChatGPTCommon";
import {AxiosResponse} from "axios";
import {createWebReadableStreamResponse, getUserInfo, OpenAi} from "@/common/server/CommonUtils";

interface GetMessageParams {
    model: string,
    message: ChatMessage,
    sessionId?: string
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: GetMessageParams = await request.json()
    // @todo add message to complete
    const res: AxiosResponse | null = await completion(params)
    return createWebReadableStreamResponse(res?.data, params.sessionId, params.model)
}

const completion = (params: GetMessageParams): Promise<AxiosResponse> => {
    return OpenAi.createCompletion({
        model: params.model,
        prompt: params.message.content,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    },{ responseType: "stream" })
}