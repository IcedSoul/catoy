import { openAiClient } from "../OpenAiClient";


export async function GET(request: Request) {
    const models = await openAiClient.listModels()
    return new Response('Hello, 123!')
}