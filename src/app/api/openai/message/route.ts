import {
    ChatMessage
} from "@/common/ChatGPTCommon";
import {AxiosResponse} from "axios";
import {createWebReadableStreamResponse, OpenAiApi, SupportModels} from "@/common/server/CommonUtils";
import {addMessage, getMessages} from "@/common/server/repository/Messages";

interface GetMessageParams {
    model: string,
    message: ChatMessage,

    historyMessage: Array<ChatMessage>
}


export async function POST(request: Request){
    const params: GetMessageParams = await request.json()
    params.historyMessage = await getMessages()
    addMessage(params.message)
    const completion: AxiosResponse | null = await getOpenAIResponse(params)
    return createWebReadableStreamResponse(completion?.data)
}

const getOpenAIResponse = (params: GetMessageParams): Promise<AxiosResponse> | null => {
    if(SupportModels.chat.includes(params.model)){
        return chat(params);
    } else if (SupportModels.chat.includes(params.model)){
        return completion(params)
    }
    return null
}

const chat = (params: GetMessageParams): Promise<AxiosResponse> => {
    return OpenAiApi.createChatCompletion({
        model: params.model,
        messages: [...params.historyMessage, params.message],
        stream: true,
        max_tokens: 2048
    }, { responseType: "stream" })
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