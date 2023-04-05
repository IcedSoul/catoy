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
    const historyMessages = await getMessages()
    addMessage(params.message)
    const res: AxiosResponse | null = await chat(params, historyMessages)
    return createWebReadableStreamResponse(res?.data)
}

const chat = (params: GetMessageParams, historyMessages: Array<ChatMessage>): Promise<AxiosResponse> => {
    return OpenAiApi.createChatCompletion({
        model: params.model,
        messages: [...historyMessages, params.message],
        stream: true,
        max_tokens: 2048
    }, { responseType: "stream" })
}