import {ChatMessage} from "@/common/ChatGPTCommon";
import {appendFile, readFile, writeFile} from "@/common/server/repository/FileUtil";


export const getMessages = async (): Promise<Array<ChatMessage>> => {
    let msg = await readFile("messages")
    msg = msg?.trim().slice(0, -1) || msg
    return JSON.parse(`[${msg}]`)
}

export const addMessage = (message: ChatMessage) => {
    appendFile("messages", JSON.stringify(message)).then()
}

export const clearMessage = () => {
    writeFile("messages", "").then()
}