import {ChatMessage, SessionUser} from "@/common/client/ChatGPTCommon";
import {AxiosResponse} from "axios";
import {createWebReadableStreamResponse, getUserInfo, OpenAi} from "@/common/server/CommonUtils";
import {messageService} from "@/common/server/services/MessageService";

interface GetMessageParams {
    model: string,
    message: ChatMessage,
    sessionId?: string
}


export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: GetMessageParams = await request.json()
    const historyMessages = params.sessionId ? await messageService.getChatMessages(user.email, params.sessionId) : []
    messageService.saveMessage(params.message, params.sessionId, params.model).then()
    const res: AxiosResponse | null = await chat(params, historyMessages)
    return createWebReadableStreamResponse(res?.data, params.sessionId, params.model)
}

const chat = (params: GetMessageParams, historyMessages: Array<ChatMessage>): Promise<AxiosResponse> => {
    return OpenAi.createChatCompletion({
        model: params.model,
        messages: [...historyMessages, params.message],
        stream: true,
        max_tokens: 2048
    }, { responseType: "stream" })
}