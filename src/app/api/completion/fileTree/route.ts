import {getUserInfo} from "@/common/server/CommonUtils";
import {SessionUser} from "@/common/client/ChatGPTCommon";
import {fileTreeService} from "@/common/server/services/FileTreeService";
import {NextResponse} from "next/server";

export async function GET(request: Request){
    const user: SessionUser = await getUserInfo()
    const userFileDataTrees = await fileTreeService.getUserFileTree(user.email, 'code');
    return NextResponse.json(userFileDataTrees)
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const fileTree = await request.json()
    await fileTreeService.addUserFileTree(user.email, 'code', fileTree)
    return NextResponse.json(fileTree)
}

export async function PUT(request: Request){
    const user: SessionUser = await getUserInfo()
    const fileTree = await request.json()
    await fileTreeService.updateUserFileTree(user.email, 'code', fileTree)
    return NextResponse.json(fileTree)
}

export async function DELETE(request: Request){
    const user: SessionUser = await getUserInfo()
    const fileTreeId: {id: string} = await request.json()
    await fileTreeService.removeUserFileTree(user.email, 'code', fileTreeId.id)
    return NextResponse.json(fileTreeId)
}