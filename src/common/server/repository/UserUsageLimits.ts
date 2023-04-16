import {Collection, Filter} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";
import {UserUsageLimit} from "@/common/server/repository/Models";

export interface UserUsageLimitsPojo extends Document, UserUsageLimit {

}

class UserUsageLimits {
    private userUsageLimitsCollection: Collection<UserUsageLimitsPojo>

    constructor() {
        this.userUsageLimitsCollection = mongoClient.getCollection<UserUsageLimitsPojo>(mongoDbInfo.collections.UserUsageLimits)
    }

    async getUserUsageLimit(email: string): Promise<UserUsageLimit | null> {
        const query: Filter<UserUsageLimitsPojo> = {email: email}
        return this.userUsageLimitsCollection.findOne(query)
    }

    async addUserUsageLimit(userUsageLimit: UserUsageLimit): Promise<boolean> {
        const insertUserUsageLimit: UserUsageLimitsPojo = JSON.parse(JSON.stringify(userUsageLimit))
        return this.userUsageLimitsCollection.insertOne(insertUserUsageLimit).then(() => true).catch(() => false)
    }

    async updateUserUsageLimit(userUsageLimit: UserUsageLimit): Promise<boolean> {
        const updateUserUsageLimit = {$set: {chatUsage: userUsageLimit.chatUsage}}
        const query = {email: userUsageLimit.email}
        return this.userUsageLimitsCollection.updateOne(query, updateUserUsageLimit).then(() => true).catch(() => false)
    }

    async deleteUserUsageLimit(email: string): Promise<boolean> {
        const query = {email: email}
        return this.userUsageLimitsCollection.deleteOne(query).then(() => true).catch(() => false)
    }
}

export const userUsageLimits = new UserUsageLimits()