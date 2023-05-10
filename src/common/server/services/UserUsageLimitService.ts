import {userUsageLimits} from "@/common/server/repository/UserUsageLimits";
import {isGPT4, isSameDay} from "@/common/server/CommonUtils";
import {UserUsageLimit} from "@/common/server/repository/Models";

class UserUsageLimitService{

    increaseChatUsage = (email: string, model?: string) => {
        userUsageLimits.getUserUsageLimit(email).then((userUsageLimit) => {
            if(userUsageLimit) {
                userUsageLimit = this.clearDailyUsage(userUsageLimit)
                // gpt-4 model has different limited
                if (model && isGPT4(model)) {
                    console.log(`userUsageLimit: ${JSON.stringify(userUsageLimit)}`)
                    if(!userUsageLimit?.gpt4Usage) {
                        userUsageLimit.gpt4Usage = 0
                    }
                    if(!userUsageLimit?.gpt4Limit) {
                        userUsageLimit.gpt4Limit = parseInt(process.env.DEFAULT_GPT4_LIMIT || "2000")
                    }
                    if(!userUsageLimit?.dailyGpt4Usage) {
                        userUsageLimit.dailyGpt4Usage = 0
                    }
                    if(!userUsageLimit?.dailyGpt4Limit) {
                        userUsageLimit.dailyGpt4Limit = parseInt(process.env.DEFAULT_DAILY_GPT4_LIMIT || "100")
                    }
                    if(userUsageLimit.dailyGpt4Usage >= userUsageLimit.dailyGpt4Limit){
                        throw new Error("Daily GPT-4 usage limit exceeded")
                    }
                    if (userUsageLimit.gpt4Usage >= userUsageLimit.gpt4Limit) {
                        throw new Error("GPT-4 usage limit exceeded")
                    }
                    userUsageLimit.dailyGpt4Usage += 1
                    userUsageLimit.gpt4Usage += 1
                } else {
                    if(!userUsageLimit?.dailyChatUsage) {
                        userUsageLimit.dailyChatUsage = 0
                    }
                    if(!userUsageLimit?.dailyChatLimit) {
                        userUsageLimit.dailyChatLimit = parseInt(process.env.DEFAULT_DAILY_CHAT_LIMIT || "1000")
                    }
                    if(userUsageLimit.dailyChatUsage >= userUsageLimit.dailyChatLimit){
                        throw new Error("Daily chat usage limit exceeded")
                    }
                    if (userUsageLimit.chatUsage >= userUsageLimit.chatLimit) {
                        throw new Error("Chat usage limit exceeded")
                    }
                    userUsageLimit.dailyChatUsage += 1
                    userUsageLimit.chatUsage += 1
                }
                userUsageLimits.updateUserUsageLimit(userUsageLimit).then()
            } else {
                this.initializeChatUsage(email)
            }
        })
    }

    clearDailyUsage = (userUsageLimit: UserUsageLimit) => {
        const today = new Date()
        const lastUpdate = userUsageLimit.lastUpdate || new Date()
        if(!isSameDay(today, lastUpdate)) {
            userUsageLimit.dailyChatUsage = 0
            userUsageLimit.dailyGpt4Usage = 0
            userUsageLimit.lastUpdate = today
        }
        return userUsageLimit
    }

    initializeChatUsage = (email: string) => {
        userUsageLimits.addUserUsageLimit(
            {
                email: email,
                chatLimit: parseInt(process.env.DEFAULT_CHAT_LIMIT || "10000"),
                chatUsage: 0,
                dailyChatLimit: parseInt(process.env.DEFAULT_DAILY_CHAT_LIMIT || "1000"),
                dailyChatUsage: 0,
                gpt4Limit: parseInt(process.env.DEFAULT_GPT4_LIMIT || "2000"),
                gpt4Usage: 0,
                dailyGpt4Limit: parseInt(process.env.DEFAULT_DAILY_GPT4_LIMIT || "100"),
                dailyGpt4Usage: 0,
                lastUpdate: new Date()
            }
        ).then()
    }
}

export const userUsageLimitsService = new UserUsageLimitService()