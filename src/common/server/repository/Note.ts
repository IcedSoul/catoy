import {Note} from "@/common/server/repository/Models";
import {Collection} from "mongodb";
import {mongoClient, mongoDbInfo} from "@/common/server/mongo/MongoClient";

interface NotePojo extends Document, Note {

}

class Notes {
    private notesCollection: Collection<NotePojo>

    constructor() {
        this.notesCollection = mongoClient.getCollection<NotePojo>(mongoDbInfo.collections.Note)
    }

    async getNoteByUser(email: string, noteId?: string): Promise<Array<Note>> {
        const query = {userEmail: email, ...(noteId && {noteId})}
        return this.notesCollection.find(query).toArray()
    }

    async addNote (note: Note): Promise<boolean> {
        const insertNote: NotePojo = JSON.parse(JSON.stringify(note))
        return this.notesCollection.insertOne(insertNote).then(() => true).catch(() => false)
    }

    async removeNote (email: string, noteId: string): Promise<boolean> {
        const query = {userEmail: email, noteId}
        return this.notesCollection.deleteMany(query).then(() => true).catch(() => false)
    }

    async updateNote (note: Note): Promise<boolean> {
        const updateNote = {$set: {title: note.title, content: note.content}}
        const query = {userEmail: note.userEmail, noteId: note.noteId}
        return this.notesCollection.updateOne(query, updateNote).then(() => true).catch(() => false)
    }
}

export const notes = new Notes()