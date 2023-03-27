
export enum MessageSource {
    ME,
    CHAT_GPT
}
export interface ChatMessage {
    from: MessageSource,
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