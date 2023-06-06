import {ChatMessage, SessionUser} from "@/common/client/ChatGPTCommon";

export interface User extends SessionUser{
    _id?: string,
    sources: Array<string>,
    password?: string,
}

export interface Message extends ChatMessage {
    sessionId: string | null,
    userEmail: string,
    model?: string,
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
    dailyChatUsage: number,
    dailyChatLimit: number,
    gpt4Limit: number,
    gpt4Usage: number,
    dailyGpt4Usage: number,
    dailyGpt4Limit: number,
    lastUpdate: Date,
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

export interface FileTreeData {
    id: string,
    userEmail: string,
    classification: "note" | "code",
    name: string,
    content: string,
}

export interface Note {
    noteId: string,
    userEmail: string,
    title: string,
    content: string,
    version: string,
    share: boolean,
    shareUrl: string,
    tags: Array<string>,
    createTime: Date,
    updateTime: Date,
}