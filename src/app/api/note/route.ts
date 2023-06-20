import {SessionUser} from "@/common/client/ChatGPTCommon";
import {getUserInfo} from "@/common/server/CommonUtils";
import {noteService} from "@/common/server/services/NoteService";

export async function GET(request: Request){
    const user: SessionUser = await getUserInfo()
    const noteId = new URL(request.url).searchParams.get("noteId") || ""
    const note = await noteService.getNote(user.email, noteId)
    return new Response(JSON.stringify(note), {status: 200})
}

export async function POST(request: Request){
    const user: SessionUser = await getUserInfo()
    const note = await request.json()
    const newNote = await noteService.addNote(user, note)
    return new Response(JSON.stringify(newNote), {status: 200})
}

export async function PUT(request: Request){
    const user: SessionUser = await getUserInfo()
    const note = await request.json()
    if(user.email !== note.userEmail){
        return new Response(null, {status: 403})
    }
    await noteService.updateNote(note)
    return new Response(JSON.stringify(note), {status: 200})
}

export async function DELETE(request: Request){
    const user: SessionUser = await getUserInfo()
    const params: {noteId: string} = await request.json()
    const result = await noteService.removeNote(user.email, params.noteId)
    return new Response(JSON.stringify(result), {status: 200})
}