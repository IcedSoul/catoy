import {CodeSegment} from "@/common/server/repository/Models";
import {codeSegments} from "@/common/server/repository/CodeSegments";
import {SessionUser} from "@/common/client/ChatGPTCommon";
import {randomUUID} from "crypto";
import {CodeCompleteParams} from "@/app/api/completion/code/complete/route";
import {OpenAiApi, splitCode} from "@/common/server/CommonUtils";
import {AxiosResponse} from "axios";

class CodeSegmentService {

    getCodeSegment = async (email: string, language?:string, codeId?: string): Promise<Array<CodeSegment>> => {
        return codeSegments.getCodeSegmentByUser(email, language, codeId)
    }
    createCodeSegment = async (user: SessionUser, codeSegment: CodeSegment) => {
        codeSegment.codeId = randomUUID()
        codeSegment.userEmail = user.email
        codeSegment.version = "0.0.1"
        await codeSegments.addCodeSegment(codeSegment)
        return codeSegment
    }

    updateCodeSegment = async (codeSegment: CodeSegment) => {
        return codeSegments.updateCodeSegment(codeSegment)
    }

    removeCodeSegment = async (email: string, codeId: string) => {
        return codeSegments.removeCodeSegment(email, codeId)
    }

    completeCode = (params: CodeCompleteParams): Promise<AxiosResponse> => {
        const {prompt, suffix} = splitCode(params.code, params.position)
        return OpenAiApi.createCompletion({
            model: params.model,
            prompt: prompt,
            suffix: suffix,
            stream: true,
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        },{ responseType: "stream" })
    }
}

export const codeSegmentService = new CodeSegmentService()