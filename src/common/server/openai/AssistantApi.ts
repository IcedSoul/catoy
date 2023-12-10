import {GPTModel, GPTToolConfig} from "@/common/server/openai/Models";
import {OpenAi, StreamRequestOptions} from "@/common/server/CommonUtils";
import {Assistant, AssistantCreateParams} from "openai/src/resources/beta/assistants/assistants";
import {ThreadCreateParams} from "openai/src/resources/beta/threads/threads";
import {Thread} from "openai/resources/beta";
import {MessageCreateParams, ThreadMessage} from "openai/src/resources/beta/threads/messages/messages";
import {RunCreateParams} from "openai/src/resources/beta/threads/runs/runs";


export interface AssistantConfig {
    name: string,
    instructions: string,
    tools: Array<GPTToolConfig>,
    model: GPTModel,
}
class AssistantApi {
    createAssistant = async (assistantCreateParams: AssistantCreateParams): Promise<Assistant> =>  {
        return OpenAi.beta.assistants.create(assistantCreateParams)
    }

    createThread = async (threadCreateParams: ThreadCreateParams): Promise<Thread> => {
        return OpenAi.beta.threads.create(threadCreateParams)
    }

    addMessageToThread = async (threadId: string, message: MessageCreateParams): Promise<ThreadMessage> => {
        return OpenAi.beta.threads.messages.create(threadId, message)
    }

    runAssistant = async (threadId: string, runCreateParams: RunCreateParams): Promise<Assistant> => {
        return OpenAi.beta.threads.runs.create(threadId, runCreateParams, StreamRequestOptions)
    }

}

export const assistantApi = new AssistantApi()
