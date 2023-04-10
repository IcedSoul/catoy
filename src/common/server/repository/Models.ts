import {ChatMessage, SessionUser} from "@/common/ChatGPTCommon";

export interface User extends SessionUser{
    _id?: string,
    id: string,
    password?: string
}

export interface Message extends ChatMessage {
    sessionId: string | null,
    userEmail: string
}

export interface Session {
    sessionId: string,
    title: string,
    userEmail: string
}