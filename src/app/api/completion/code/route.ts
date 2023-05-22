import {SessionUser} from "@/common/client/ChatGPTCommon";
import { getUserInfo } from "@/common/server/CommonUtils";
import {codeSegmentService} from "@/common/server/services/CodeSegmentService";
import {CodeSegment} from "@/common/server/repository/Models";
import {NextResponse} from "next/server";

export async function GET(request: Request){
    const user: SessionUser = await getUserInfo()
    const codeId = new URL(request.url).searchParams.get("codeId") || ""
    const language = new URL(request.url).searchParams.get("language") || ""
    const codeSegments: Array<CodeSegment> = await codeSegmentService.getCodeSegment(user.email, language, codeId)
    return new Response(JSON.stringify(codeSegments), {status: 200})
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: CodeSegment = await request.json()
    const codeSegment = await codeSegmentService.createCodeSegment(user, params)
    return NextResponse.json(codeSegment)
}

export async function PUT(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: CodeSegment = await request.json()
    if(user.email !== params.userEmail){
        return new Response(null, {status: 403})
    }
    await codeSegmentService.updateCodeSegment(params)
    return NextResponse.json(params)
}

export async function DELETE(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: {codeId: string} = await request.json()
    await codeSegmentService.removeCodeSegment(user.email, params.codeId)
    return new Response(null, {status: 200})
}