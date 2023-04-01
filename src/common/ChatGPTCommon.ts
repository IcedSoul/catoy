export enum MessageSource {
    USER = "user",
    ASSISTANT = "assistant"
}
export interface ChatMessage {
    role: MessageSource,
    content: string
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

