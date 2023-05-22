import {Collection} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";
import {FileTreeData} from "@/common/server/repository/Models";

interface FileTreeDataPojo extends Document, FileTreeData {

}
class FileTrees {
    private fileTreeDataCollection: Collection<FileTreeDataPojo>

    constructor() {
        this.fileTreeDataCollection = mongoClient.getCollection<FileTreeDataPojo>(mongoDbInfo.collections.FileTreeData)
    }

    async getFileTreeDataByUser(userEmail: string, classification: "doc" | "code"): Promise<Array<FileTreeData>> {
        const query = {userEmail, classification}
        return this.fileTreeDataCollection.find(query).toArray()
    }

    async addFileTreeData(fileTreeData: FileTreeData): Promise<boolean> {
        const insertFileTreeData: FileTreeDataPojo = JSON.parse(JSON.stringify(fileTreeData))
        return this.fileTreeDataCollection.insertOne(insertFileTreeData).then(() => true).catch(() => false)
    }

    async removeFileTreeData(userEmail: string, classification: "doc" | "code", id: string): Promise<boolean> {
        const query = {userEmail, classification, id}
        return this.fileTreeDataCollection.deleteMany(query).then(() => true).catch(() => false)
    }

    async updateFileTreeData(fileTreeData: FileTreeData): Promise<boolean> {
        const updateFileTreeData = {$set: {name: fileTreeData.name, content: fileTreeData.content}}
        const query = {userEmail: fileTreeData.userEmail, classification: fileTreeData.classification, id: fileTreeData.id}
        return this.fileTreeDataCollection.updateOne(query, updateFileTreeData).then(() => true).catch(() => false)
    }
}

export const fileTrees = new FileTrees()