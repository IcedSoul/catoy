import {Collection} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";
import {User} from "@/common/server/repository/Models";

export interface UserPojo extends Document, User {
}

class Users {
    private usersCollection: Collection<UserPojo>

    constructor() {
        this.usersCollection = mongoClient.getCollection<UserPojo>(mongoDbInfo.collections.User)
    }

    async getUserByTypeAndEmail(email: string, id?: string): Promise<User | null> {
        const query = {email, id}
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