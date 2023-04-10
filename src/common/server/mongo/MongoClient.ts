import {Collection, MongoClient} from "mongodb";

const url = 'mongodb://root:root@localhost:27017/admin'
export const mongoDbInfo = {
    database: 'catoy',
    collections: {
        Message: 'message',
        User: 'user',
        Session: 'session'
    }
}

class MyMongoClient {
    mongoClient = new MongoClient(url)
    mongoClientPromise: Promise<MongoClient>

    constructor() {
        this.mongoClientPromise = this.connect()
        this.mongoClientPromise.then(() => {
            console.log("Mongodb connected")
        })
    }

    connect = async () => {
        return this.mongoClient.connect();
    }

    getCollection = <T extends Document>(collection: string): Collection<T> => {
        const catoy = this.mongoClient.db(mongoDbInfo.database)
        return catoy.collection<T>(collection)
    }
}

export const mongoClient = new MyMongoClient()
