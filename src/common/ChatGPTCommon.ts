import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: 'org-dgp2h4U3CLUur0pCnGGzkKBp',
    apiKey: process.env.OPENAI_API_KEY,
});

export const OpenAiApi = new OpenAIApi(configuration)

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