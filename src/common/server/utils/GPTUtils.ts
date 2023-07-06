import {ChatMessage} from "@/common/client/ChatGPTCommon";
import {isGPT4} from "@/common/server/CommonUtils";

export const checkAndFilterMessageHistory = ( historyMessage: Array<ChatMessage>, model: string ): Array<ChatMessage> =>{
    const contextLimit = isGPT4(model) ? parseInt(process.env.DEFAULT_CHAT_GPT4_CONTEXT_TOEKNS_LIMIT || "5000") : parseInt(process.env.DEFAULT_CHAT_GPT4_CONTEXT_TOEKNS_LIMIT || "3000")
    let totalContextTokens = 0
    for(let i = historyMessage.length - 1; i >= 0; i--) {
        totalContextTokens += JSON.stringify(historyMessage[i]).length
        if(totalContextTokens > contextLimit) {
            historyMessage = historyMessage.slice(i + 1)
            break
        }
    }
    return historyMessage
}