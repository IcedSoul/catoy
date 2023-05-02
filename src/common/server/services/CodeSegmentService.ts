import {CodeSegment} from "@/common/server/repository/Models";
import {codeSegments} from "@/common/server/repository/CodeSegments";
import {SessionUser} from "@/common/client/ChatGPTCommon";
import {randomUUID} from "crypto";

class CodeSegmentService {

    getCodeSegment = async (email: string, language?:string, codeId?: string): Promise<Array<CodeSegment>> => {
        return codeSegments.getCodeSegmentByUser(email, language, codeId)
    }
    createCodeSegment = async (user: SessionUser, codeSegment: CodeSegment) => {
        codeSegment.codeId = randomUUID()
        codeSegment.userEmail = user.email
        codeSegment.version = "0.0.1"
        return codeSegments.addCodeSegment(codeSegment)
    }

    updateCodeSegment = async (codeSegment: CodeSegment) => {
        return codeSegments.updateCodeSegment(codeSegment)
    }

    removeCodeSegment = async (email: string, codeId: string) => {
        return codeSegments.removeCodeSegment(email, codeId)
    }
}

export const codeSegmentService = new CodeSegmentService()