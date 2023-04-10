import {Session} from "@/common/server/repository/Models";
import {Collection} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";

export interface SessionPojo extends Document, Session {
}
class Sessions{
    private sessionsCollection: Collection<SessionPojo>

    constructor() {
        this.sessionsCollection = mongoClient.getCollection<SessionPojo>(mongoDbInfo.collections.Session)
    }

    async getSessionByEmail(email: string): Promise<Array<Session>> {
        const query = {email}
        return this.sessionsCollection.find(query).toArray()
    }

    async addSession(session: Session): Promise<boolean> {
        const insertSession: SessionPojo = JSON.parse(JSON.stringify(session))
        return this.sessionsCollection.insertOne(insertSession).then(() => true).catch(() => false)
    }

    async removeSession(email: string, sessionId: string): Promise<boolean> {
        const query = {userEmail: email, sessionId}
        return this.sessionsCollection.deleteMany(query).then(() => true).catch(() => false)
    }
}

export const sessions = new Sessions()