
export enum GPTModel {
    GPT3 = 'gpt-3.5-turbo-1106',
    GPT4 = 'gpt-4-1106-preview',
    GPT4Vision = 'gpt-4-vision-preview',
}

export enum GPTTool {
    CODE_INTERPRETER = 'code-interpreter',
    RETRIEVAL = 'retrieval',
    FUNCTION = 'function',
}

export interface GPTToolConfig {
    type: GPTTool,
    function?: any
}

export const SupportModels = {
    completion: [GPTModel.GPT3, GPTModel.GPT4],
    chat: [GPTModel.GPT3, GPTModel.GPT4]
}