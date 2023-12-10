import {
    CHAT_SESSION_ID,
    ChatMessage, MessageSource, SessionUser
} from "@/common/client/ChatGPTCommon";
import {AxiosResponse} from "axios";
import {
    createWebReadableStreamResponse,
    getUserInfo,
    OpenAi,
} from "@/common/server/CommonUtils";
import {messageService} from "@/common/server/services/MessageService";
import {randomUUID} from "crypto";
import {sessionService} from "@/common/server/services/SessionService";
import {checkAndFilterMessageHistory} from "@/common/server/utils/GPTUtils";
import {SupportModels} from "@/common/server/openai/Models";

interface GetMessageParams {
    model: string,
    message: ChatMessage,
    sessionId?: string,
    historyMessage: Array<ChatMessage>,
    userEmail?: string,
    reGenerate?: boolean,
    modify?: boolean
}

const systemPrompt = {
    role: MessageSource.SYSTEM,
    content: "Please use Markdown syntax for all answers and follow the rules below: \n " +
        "1. If the answer contains code snippets, please specify the specific language. \n " +
        "2. Try to reply in the primary language of the user, unless the user has explicitly requested that another language be used.",
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: GetMessageParams = await request.json()
    params.userEmail = user.email
    params.historyMessage = []
    params.message = {
        role: params.message.role,
        content: params.message.content,
    }
    if(params.sessionId){
        params.historyMessage = await messageService.getChatMessages(user.email, params.sessionId)
        if(params.historyMessage.length === 0){
            params.sessionId = ""
        }
        const contextLimit = parseInt(process.env.DEFAULT_CHAT_COTEXT_LIMIT || "20")
        if(params.historyMessage.length > contextLimit){
            params.historyMessage = params.historyMessage.slice(-contextLimit)
        }
        // handle reGenerate
        if(params.historyMessage.length >= 2 && params.reGenerate){
            await messageService.deleteMessages(user.email, params.sessionId, 2)
            params.historyMessage = params.historyMessage.slice(0, -2)
        }
    }
    if(!params.sessionId){
        params.sessionId = randomUUID()
        sessionService.createSession(params.sessionId, params.message.content.slice(0, 15).concat("..."), user.email).then()
    }
    messageService.saveMessage(params.message, params.sessionId, params.model).then()
    const completion: AxiosResponse | null = await getOpenAIResponse(params)
    const response = createWebReadableStreamResponse(completion?.data, params.sessionId, params.model)
    response.cookies.set(CHAT_SESSION_ID, params.sessionId)

    return response
}

const getOpenAIResponse = (params: GetMessageParams): Promise<AxiosResponse> | null => {
    if(SupportModels.chat.includes(params.model)){
        checkAndFilterMessageHistory(params.historyMessage, params.model)
        return chat(params);
    } else if (SupportModels.chat.includes(params.model)){
        return completion(params)
    }
    return null
}

const chat = (params: GetMessageParams): Promise<AxiosResponse> => {
    return OpenAi.createChatCompletion({
        model: params.model,
        messages: [systemPrompt, ...params.historyMessage, params.message],
        stream: true,
        max_tokens: 1024,
        user: params.userEmail
    }, { responseType: "stream" })
}

const completion = (params: GetMessageParams): Promise<AxiosResponse> => {
    return OpenAi.createCompletion({
        model: params.model,
        prompt: params.message.content,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: params.userEmail
    },{ responseType: "stream" })
}