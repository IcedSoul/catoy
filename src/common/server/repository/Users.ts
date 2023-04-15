import {Collection, Filter} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";
import {User} from "@/common/server/repository/Models";
import {AccountSource} from "@/common/server/CommonUtils";

export interface UserPojo extends Document, User {
}

class Users {
    private usersCollection: Collection<UserPojo>

    constructor() {
        this.usersCollection = mongoClient.getCollection<UserPojo>(mongoDbInfo.collections.User)
    }

    async getUserByEmailAndSource(email: string, source?: AccountSource): Promise<User | null> {
        const query: Filter<UserPojo> = {email: email, sources: source ? source : {$exists: true}}
        return this.usersCollection.find(query).toArray().then((users) => {
            if (users.length === 0) {
                return null
            }
            return users[0]
        })
    }

    async addUser(user: User): Promise<boolean> {
        const insertUser: UserPojo = JSON.parse(JSON.stringify(user))
        return this.usersCollection.insertOne(insertUser).then(() => true).catch(() => false)
    }

    async updateUser(user: User): Promise<boolean> {
        const updateUser: UserPojo = JSON.parse(JSON.stringify(user))
        const query = {email: user.email}
        return this.usersCollection.updateOne(query, updateUser).then(() => true).catch(() => false)
    }

    async deleteUser(email: string): Promise<boolean> {
        const query = {email: email}
        return this.usersCollection.deleteOne(query).then(() => true).catch(() => false)
    }
}

export const users = new Users()