import {Collection, MongoClient} from "mongodb";

const url = 'mongodb://root:root@localhost:27017/admin'
export const mongoDbInfo = {
    database: 'catoy',
    collections: {
        Message: 'message'
    }
}

class MyMongoClient {
    mongoClient = new MongoClient(url);

    constructor() {
        this.connect().then(console.log)
    }

    connect = async () => {
        await this.mongoClient.connect();
        console.log('Connected successfully to server');
        return 'done.';
    }

    getCollection = <T extends Document>(collection: string): Collection<T> => {
        const catoy = this.mongoClient.db(mongoDbInfo.database)
        return catoy.collection<T>(collection)
    }

    dispose = () => {
        mongoClient.dispose()
    }
}

export const mongoClient = new MyMongoClient()
