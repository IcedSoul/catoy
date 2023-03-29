import {OpenAiApi} from "@/common/ChatGPTCommon";

interface GetMessageParams {
    model: string,
    content: string
}


export async function POST(request: Request){
    const params: GetMessageParams = await request.json()
    console.log(JSON.stringify(params))
    const { data: response, status } = await OpenAiApi.createCompletion({
        model: params.model,
        prompt: params.content,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    if(status !== 200 || !response){
        return new Response(JSON.stringify({ content: "Network error, please retry." }))
    }
    console.log("res: " + response.choices[0].text)
    return new Response(JSON.stringify({ content: response.choices[0].text }))
}