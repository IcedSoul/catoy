import {NextResponse} from "next/server";
import { messages } from "@/common/server/repository/Messages";
import {SessionUser} from "@/common/ChatGPTCommon";
import {getUserInfo} from "@/common/server/CommonUtils";


export async function GET(request: Request) {
    const user: SessionUser = await getUserInfo()
    const sessionId = new URL(request.url).searchParams.get("sessionId") || ""
    const msg = await messages.getMessages(user.email, sessionId) || []
    return NextResponse.json(msg)
}
