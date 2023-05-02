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

export interface CodeSegment {
    codeId: string,
    userEmail: string,
    title: string,
    suffix: string,
    language: string,
    code: string,
    version: string,
    gitUrl: string,
}