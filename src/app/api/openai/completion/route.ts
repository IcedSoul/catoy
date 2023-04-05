import {ChatMessage} from "@/common/ChatGPTCommon";
import {addMessage, getMessages} from "@/common/server/repository/Messages";
import {AxiosResponse} from "axios";
import {createWebReadableStreamResponse, OpenAiApi} from "@/common/server/CommonUtils";

interface GetMessageParams {
    model: string,
    message: ChatMessage
}

export async function POST(request: Request){
    const params: GetMessageParams = await request.json()
    addMessage(params.message)
    const res: AxiosResponse | null = await completion(params)
    return createWebReadableStreamResponse(res?.data)
}

const completion = (params: GetMessageParams): Promise<AxiosResponse> => {
    return OpenAiApi.createCompletion({
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