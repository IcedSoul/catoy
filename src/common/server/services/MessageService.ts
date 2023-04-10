import {ChatMessage} from "@/common/ChatGPTCommon";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {redirect} from "next/navigation";
import {Message} from "@/common/server/repository/Models";
import {messages} from "@/common/server/repository/Messages";


class MessageService {

    getChatMessages = async (userEmail: string, sessionId: string): Promise<Array<ChatMessage>> => {
        return messages.getMessages(userEmail, sessionId).then<Array<ChatMessage>>((messageList: Array<Message>) => {
            return messageList.map((message: Message) => {
                const chatMessage: ChatMessage = {
                    role: message.role,
                    content: message.content
                }
                return chatMessage
            });
        })
    }

    saveMessage = async (chatMessage: ChatMessage, sessionId?: string) => {
        const session = await getServerSession(authOptions)
        if(!session || !session.user || !session.user.email) {
            return redirect('/auth/login')
        }
        console.log(`session ${JSON.stringify(session)} `)
        const message: Message = {
            sessionId: sessionId || null,
            userEmail: session.user.email,
            role: chatMessage.role,
            content: chatMessage.content,
        }
        messages.addMessage(message).then()
    }
}

export const messageService = new MessageService()