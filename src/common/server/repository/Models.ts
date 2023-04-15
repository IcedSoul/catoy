import {ChatMessage, SessionUser} from "@/common/client/ChatGPTCommon";

export interface User extends SessionUser{
    _id?: string,
    sources: Array<string>,
    password?: string,
}

export interface Message extends ChatMessage {
    sessionId: string | null,
    userEmail: string
}

export interface Session {
    sessionId: string,
    title: string,
    userEmail: string,
    limit?: number,
}

export interface UserUsageLimit {
    email: string,
    chatLimit: number,
    chatUsage: number,
}