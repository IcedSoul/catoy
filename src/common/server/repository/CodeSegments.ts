import {CodeSegment} from "@/common/server/repository/Models";
import {Collection} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";

interface CodeSegmentsPojo extends Document, CodeSegment {

}

class CodeSegments{
    private codeSegmentsCollection: Collection<CodeSegmentsPojo>

    constructor() {
        this.codeSegmentsCollection = mongoClient.getCollection<CodeSegmentsPojo>(mongoDbInfo.collections.CodeSegment)
    }

    async getCodeSegmentByUser(email: string, language?:string, codeId?: string): Promise<Array<CodeSegment>> {
        const query = {userEmail: email, ...(language && {language}), ...(codeId && {codeId})}
        return this.codeSegmentsCollection.find(query).toArray()
    }

    async addCodeSegment(codeSegment: CodeSegment): Promise<boolean> {
        const insertCodeSegment: CodeSegmentsPojo = JSON.parse(JSON.stringify(codeSegment))
        return this.codeSegmentsCollection.insertOne(insertCodeSegment).then(() => true).catch(() => false)
    }

    async removeCodeSegment(email: string, codeId: string): Promise<boolean> {
        const query = {userEmail: email, codeId}
        return this.codeSegmentsCollection.deleteMany(query).then(() => true).catch(() => false)
    }

    async updateCodeSegment(codeSegment: CodeSegment): Promise<boolean> {
        const updateCodeSegment = {$set: {code: codeSegment.code}}
        const query = {userEmail: codeSegment.userEmail, codeId: codeSegment.codeId}
        return this.codeSegmentsCollection.updateOne(query, updateCodeSegment).then(() => true).catch(() => false)
    }
}

export const codeSegments = new CodeSegments()