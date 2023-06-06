import {getUserInfo} from "@/common/server/CommonUtils";
import {SessionUser} from "@/common/client/ChatGPTCommon";
import {fileTreeService} from "@/common/server/services/FileTreeService";
import {NextResponse} from "next/server";

export async function GET(request: Request){
    const user: SessionUser = await getUserInfo()
    const params = new URLSearchParams(new URL(request.url).searchParams)
    const type = params?.get('type') === 'note' ? 'note' : 'code'
    const userFileDataTrees = await fileTreeService.getUserFileTree(user.email, type);
    return NextResponse.json(userFileDataTrees)
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const fileTree = await request.json()
    await fileTreeService.addUserFileTree(user.email, fileTree.classification, fileTree)
    return NextResponse.json(fileTree)
}

export async function PUT(request: Request){
    const user: SessionUser = await getUserInfo()
    const fileTree = await request.json()
    await fileTreeService.updateUserFileTree(user.email, fileTree.classification, fileTree)
    return NextResponse.json(fileTree)
}

export async function DELETE(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: {id: string, classification: "code" | "note"} = await request.json()
    await fileTreeService.removeUserFileTree(user.email, params.classification, params.id)
    return NextResponse.json(params)
}