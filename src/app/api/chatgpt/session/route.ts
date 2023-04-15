import {SessionUser} from "@/common/client/ChatGPTCommon";
import {getUserInfo} from "@/common/server/CommonUtils";
import {sessions} from "@/common/server/repository/Sessions";
import {Session} from "@/common/server/repository/Models";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    const user: SessionUser = await getUserInfo()
    const chatSessions: Array<Session> = await sessions.getSessionByEmail(user.email) || []
    return NextResponse.json(chatSessions)
}

export async function DELETE(request: Request) {
    const user: SessionUser = await getUserInfo()
    const sessionId = new URL(request.url).searchParams.get("sessionId") || ""
    if(sessionId){
        await sessions.removeSession(user.email, sessionId)
    }
    const chatSessions: Array<Session> = await sessions.getSessionByEmail(user.email) || []
    return NextResponse.json(chatSessions)
}