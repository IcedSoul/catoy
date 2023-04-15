import {userUsageLimits} from "@/common/server/repository/UserUsageLimits";

class UserUsageLimitService{

    increaseChatUsage = (email: string) => {
        userUsageLimits.getUserUsageLimit(email).then((userUsageLimit) => {
            if(userUsageLimit){
                if(userUsageLimit.chatUsage >= userUsageLimit.chatLimit){
                    throw new Error("Chat usage limit exceeded")
                }
                userUsageLimit.chatUsage += 1
                userUsageLimits.updateUserUsageLimit(userUsageLimit).then()
            } else {
                this.initializeChatUsage(email)
            }
        })
    }

    initializeChatUsage = (email: string) => {
        userUsageLimits.addUserUsageLimit(
            { email: email, chatLimit: parseInt(process.env.DEFAULT_CHAT_LIMIT || "10000") , chatUsage: 0 }
        ).then()
    }
}

export const userUsageLimitsService = new UserUsageLimitService()