import {SessionUser} from "@/common/client/ChatGPTCommon";
import {createWebReadableStreamResponse, getUserInfo, SupportModels} from "@/common/server/CommonUtils";
import {codeSegmentService} from "@/common/server/services/CodeSegmentService";
import {NextResponse} from "next/server";
import {AxiosResponse} from "axios";

export interface CodeCompleteParams {
    code: string
    language: string
    model: string
    position: {
        lineNumber: number
        column: number
    }
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: CodeCompleteParams = await request.json()
    params.model = SupportModels.completion[0]
    const res: AxiosResponse | null = await codeSegmentService.completeCode(params)
    return createWebReadableStreamResponse(res?.data)
}