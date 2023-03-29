import {Model} from "openai/api";
import {OpenAiApi} from "@/common/ChatGPTCommon";

export async function GET(request: Request) {
    const response = await OpenAiApi.listModels()
    const models:Array<Model> = response?.data?.data || []
    return new Response(JSON.stringify(models))
}