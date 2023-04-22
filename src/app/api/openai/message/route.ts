import {
    CHAT_SESSION_ID,
    ChatMessage, SessionUser
} from "@/common/client/ChatGPTCommon";
import {AxiosResponse} from "axios";
import {createWebReadableStreamResponse, getUserInfo, OpenAiApi, SupportModels} from "@/common/server/CommonUtils";
import {messageService} from "@/common/server/services/MessageService";
import {randomUUID} from "crypto";
import {sessions} from "@/common/server/repository/Sessions";
import {sessionService} from "@/common/server/services/SessionService";

interface GetMessageParams {
    model: string,
    message: ChatMessage,
    sessionId?: string,
    historyMessage: Array<ChatMessage>
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: GetMessageParams = await request.json()
    params.historyMessage = []
    if(params.sessionId){
        params.historyMessage = await messageService.getChatMessages(user.email, params.sessionId)
        if(params.historyMessage.length === 0){
            params.sessionId = ""
        }
        const contextLimit = parseInt(process.env.DEFAULT_CHAT_COTEXT_LIMIT || "50")
        if(params.historyMessage.length > contextLimit){
            params.historyMessage = params.historyMessage.slice(-contextLimit)
        }
    }
    if(!params.sessionId){
        params.sessionId = randomUUID()
        sessionService.createSession(params.sessionId, params.message.content.slice(0, 12).concat("..."), user.email).then()
    }
    messageService.saveMessage(params.message, params.sessionId).then()
    const completion: AxiosResponse | null = await getOpenAIResponse(params)
    const response = createWebReadableStreamResponse(completion?.data, params.sessionId)
    response.cookies.set(CHAT_SESSION_ID, params.sessionId)

    return response
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