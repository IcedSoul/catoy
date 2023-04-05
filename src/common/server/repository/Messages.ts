import {ChatMessage} from "@/common/ChatGPTCommon";
import {appendFile, readFile, writeFile} from "@/common/server/repository/FileUtil";
import {Collection} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/mongo/MongoClient";

interface MessagePojo extends Document, ChatMessage {
}
let msgCollection: Collection<MessagePojo> | null = null
// use mongo
export const getMessages = async (): Promise<Array<ChatMessage>> => {
    msgCollection ??= mongoClient.getCollection<MessagePojo>(mongoDbInfo.collections.Message)
    return await msgCollection.find({}, { projection: { _id: 0 } }).toArray()
}

export const addMessage = (message: ChatMessage) => {
    msgCollection ??= mongoClient.getCollection(mongoDbInfo.collections.Message)
    const insertMessage: MessagePojo = JSON.parse(JSON.stringify(message))
    msgCollection.insertOne(insertMessage).then()
}

export const clearMessage = () => {
    msgCollection ??= mongoClient.getCollection(mongoDbInfo.collections.Message)
    msgCollection.drop().then()
}

// file storage (temp)
export const getMessagesFromFile = async (): Promise<Array<ChatMessage>> => {
    let msg = await readFile("messages")
    msg = msg?.trim().slice(0, -1) || msg
    return JSON.parse(`[${msg}]`)
}

export const addMessageFromFile = (message: ChatMessage) => {
    appendFile("messages", JSON.stringify(message)).then()
}

export const clearMessageFromFile = () => {
    writeFile("messages", "").then()
}