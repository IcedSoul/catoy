import {IncomingMessage} from "http";
import {ChatMessage, encoder, MessageSource, SessionUser} from "@/common/client/ChatGPTCommon";
import {Configuration, OpenAIApi} from "openai";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {redirect} from "next/navigation";
import {messageService} from "@/common/server/services/MessageService";
import {NextResponse} from "next/server";


const configuration = new Configuration({
    organization: 'org-dgp2h4U3CLUur0pCnGGzkKBp',
    apiKey: process.env.OPENAI_API_KEY,
});

export const OpenAiApi = new OpenAIApi(configuration)

export const SupportModels = {
    completion: ['text-davinci-003', 'text-davinci-002', 'text-curie-001', 'text-babbage-001', 'text-ada-001', 'davinci', 'curie', 'babbage', 'ada'],
    chat: ['gpt-3.5-turbo', 'gpt-4']
}

export const isGPT4 = (model: string): boolean => {
    return model.includes("gpt-4")
}

export const createWebReadableStreamResponse = (incomingMessage: IncomingMessage, sessionId?: string, model?: string): NextResponse => {
    let bufferMessage: string | null = null
    const chatMsg: ChatMessage = {
        role: MessageSource.ASSISTANT,
        content: '',
    }
    const readableStream = new ReadableStream({
        start(controller){
            incomingMessage
                .on('data', (data: Uint8Array) => {
                    const lines = data?.toString()?.split("\n").filter((line) => line.trim() !== "");
                    lines?.map((line) => {
                        const message = line.replace(/^data: /, "");
                        if(message === '[DONE]'){
                            sessionId && messageService.saveMessage(chatMsg, sessionId, model).then()
                            controller.close()
                        } else {
                            let res;
                            try {
                                res = JSON.parse(message)
                            } catch (e){
                                if(bufferMessage){
                                    res = JSON.parse(bufferMessage.concat(message))
                                    bufferMessage = null
                                }
                                else {
                                    bufferMessage = message
                                    return
                                }
                            }
                            if(res.object.startsWith('chat.completion')){
                                const msg = res.choices[0].delta
                                const content = msg.content ? Buffer.from(msg.content, 'utf-8').toString() : null
                                content ? chatMsg.content = chatMsg.content.concat(content) : null
                                content ? controller.enqueue(encoder.encode(content)) : null
                            } else if(res.object.startsWith('text_completion')){
                                controller.enqueue(encoder.encode(Buffer.from(res.choices[0].text, 'utf-8').toString()))
                            }
                        }
                    })
                })
                .on('error', (error: any) => {controller.error(error)})
        }
    })
    const headers = {
        'Content-Type': 'application/octet-stream'
    }
    return new NextResponse(readableStream, { headers, status: 200 })
}

export const getUserInfo = async (): Promise<SessionUser> => {
    const session = await getServerSession(authOptions)
    if(!session || !session.user || !session.user.email) {
        redirect('/auth/login')
    }
    return {
        email: session.user.email,
        name: session.user.name || session.user.email,
        image: session.user.image || ""
    }
}

export enum AccountSource {
    GOOGLE = 'google',
    GITHUB = 'github',
    CREDENTIALS = 'credentials'
}

export const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

/**
 * Split code into two parts: before and after the cursor
 * @param code - the code to split
 * @param position - the position of the cursor
 */
export const splitCode = (code: string, position: {lineNumber: number, column: number}): {prompt: string, suffix: string} => {
    const lines = code.split('\n');
    const line = position.lineNumber - 1;
    const column = position.column - 1;
    if (line >= 0 && line < lines.length) {
        const beforeLine = lines.slice(0, line).join('\n');
        const currentLine = lines[line];
        const beforeColumn = currentLine.slice(0, column);
        const afterColumn = currentLine.slice(column);
        const afterLine = lines.slice(line + 1).join('\n');

        const firstString = beforeLine + (beforeColumn ? '\n' + beforeColumn : '');
        const secondString = afterColumn + (afterLine ? '\n' + afterLine : '');

        return {prompt: firstString, suffix: secondString};
    }
    return {prompt: code, suffix: ''};
}

export const DEFAULT_AVATAR = '/avatars/default.png'