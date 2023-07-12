import {Collection} from "mongodb";
import { mongoClient, mongoDbInfo } from "@/common/server/mongo/MongoClient";
import {Message} from "@/common/server/repository/Models";

interface MessagePojo extends Document, Message {
}

class Messages{
    private messagesCollection: Collection<MessagePojo>

    constructor() {
        this.messagesCollection = mongoClient.getCollection<MessagePojo>(mongoDbInfo.collections.Message)
    }

    async getMessages(userEmail: string, sessionId: string): Promise<Array<Message>> {
        const query = { userEmail, sessionId }
        return this.messagesCollection.find(query).toArray()
    }

    async addMessage(message: Message): Promise<boolean> {
        const insertMessage: MessagePojo = JSON.parse(JSON.stringify(message))
        return this.messagesCollection.insertOne(insertMessage).then(() => true).catch(() => false)
    }

    async deleteMessageBySessionId(userEmail: string, sessionId: string, count: number): Promise<boolean> {
        const query = { userEmail, sessionId }
        const toBeDelete: Array<MessagePojo> = await this.messagesCollection.find(query).sort( { $natural: -1 }).limit(count).toArray()
        const deleteIds: Array<string> = toBeDelete.map((message) => message._id as string)
        return this.messagesCollection.deleteMany({ _id: { $in: deleteIds } }).then(() => true).catch(() => false)
    }
}

export const messages = new Messages()

// file storage (temp)
// export const getMessagesFromFile = async (): Promise<Array<ChatMessage>> => {
//     let msg = await readFile("messages")
//     msg = msg?.trim().slice(0, -1) || msg
//     return JSON.parse(`[${msg}]`)
// }
//
// export const addMessageFromFile = (message: ChatMessage) => {
//     appendFile("messages", JSON.stringify(message)).then()
// }
//
// export const clearMessageFromFile = () => {
//     writeFile("messages", "").then()
// }