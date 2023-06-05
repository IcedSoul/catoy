import {SessionUser} from "@/common/client/ChatGPTCommon";
import {getUserInfo} from "@/common/server/CommonUtils";
import {userUsageLimitsService} from "@/common/server/services/UserUsageLimitService";

export async function GET(request: Request) {
    const user: SessionUser = await getUserInfo()
    const usageLimit = await userUsageLimitsService.getUsageLimit(user.email)
    return new Response(JSON.stringify(usageLimit))
}