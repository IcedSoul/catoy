import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-dgp2h4U3CLUur0pCnGGzkKBporg-dgp2h4U3CLUur0pCnGGzkKBp",
    apiKey: process.env.OPENAI_API_KEY,
});


class OpenAiClient{
    openai = new OpenAIApi(configuration)
    constructor() {
    }

    public listModels = async () => {
        return await this.openai.listModels()
    }
}

export const openAiClient = new OpenAiClient()