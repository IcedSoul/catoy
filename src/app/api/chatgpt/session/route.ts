import {SessionUser} from "@/common/ChatGPTCommon";
import {getUserInfo} from "@/common/server/CommonUtils";
import {sessions} from "@/common/server/repository/Sessions";
import {Session} from "@/common/server/repository/Models";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    const user: SessionUser = await getUserInfo()
    const chatSessions: Array<Session> = await sessions.getSessionByEmail(user.email) || []
    return NextResponse.json(chatSessions)
}