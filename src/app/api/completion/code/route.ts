import {SessionUser} from "@/common/client/ChatGPTCommon";
import { getUserInfo } from "@/common/server/CommonUtils";
import {codeSegmentService} from "@/common/server/services/CodeSegmentService";
import {CodeSegment} from "@/common/server/repository/Models";

export async function GET(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: {codeId: string} = await request.json()
    const codeSegments: Array<CodeSegment> = await codeSegmentService.getCodeSegment(user.email, params?.codeId)
    return new Response(JSON.stringify(codeSegments), {status: 200})
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: CodeSegment = await request.json()
    await codeSegmentService.createCodeSegment(user, params)
    return new Response(null, {status: 200})
}

export async function PUT(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: CodeSegment = await request.json()
    if(user.email !== params.userEmail){
        return new Response(null, {status: 403})
    }
    await codeSegmentService.updateCodeSegment(params)
    return new Response(null, {status: 200})
}

export async function DELETE(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: {codeId: string} = await request.json()
    await codeSegmentService.removeCodeSegment(user.email, params.codeId)
    return new Response(null, {status: 200})
}