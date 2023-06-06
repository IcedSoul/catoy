export enum MessageSource {
    USER = "user",
    ASSISTANT = "assistant",
    SYSTEM = "system",
}

export interface SessionUser {
    name: string,
    email: string,
    image?: string,
}

export interface ChatMessage {
    role: MessageSource,
    content: string,
    model?: string,
}

export interface ChatGPTRef{
    loadMessages: () => Promise<void>
}


export interface NavBarRef {
    loadSessions: () => Promise<void>
}
export enum HttpMethod {
    GET = "GET",
    HEAD = "HEAD",
    OPTION = "OPTION",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

export const decoder = new TextDecoder()
export const encoder = new TextEncoder()

export interface ChatSession {
    sessionId: string,
    title: string,
}

export const CHAT_SESSION_ID = "chat-session-id"