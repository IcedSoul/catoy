import {Note} from "@/common/server/repository/Models";
import {notes} from "@/common/server/repository/Note";
import {SessionUser} from "@/common/client/ChatGPTCommon";
import {randomUUID} from "crypto";

class NoteService {
    getNote = async (userEmail: string, noteId: string): Promise<Note> => {
        return notes.getNoteByUser(userEmail, noteId).then<Note>((noteList: Array<Note>) => {
            return noteList[0]
        })
    }

    updateNote = async (note: Note) => {
        return notes.updateNote(note)
    }

    addNote = async (user: SessionUser, note: Note) => {
        note.noteId = randomUUID()
        note.userEmail = user.email
        note.version = "0.0.1"
        note.share = false
        note.tags = []
        note.createTime = new Date()
        note.updateTime = new Date()
        return notes.addNote(note)
    }

    removeNote = async (email: string, noteId: string) => {
        return notes.removeNote(email, noteId)
    }
}