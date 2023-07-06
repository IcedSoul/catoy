import {Center, Container} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {MarkdownEditor} from "@/components/util/MarkdownEditor";
import {useGlobalContext} from "@/components/providers/GlobalContextProvider";
import {NoteProps} from "@/common/client/CompleteCommon";
import {Note} from "@/common/server/repository/Models";
import {notifications} from "@mantine/notifications";
import {addCookie, getCookieByName, removeCookie} from "@/common/client/common";
import {NOTE_ID} from "@/common/client/NoteCommon";

export const Doc = () => {
    const [currentNote, setCurrentNote] = useState<Note | null>(null)
    const [currentNoteProps, setCurrentNoteProps] = useState<NoteProps | null>(null)

    const { setRefreshNote } = useGlobalContext()

    useEffect(() => {
        setRefreshNote(() => loadNotePre)
        const noteId = getCookieByName(NOTE_ID)
        if(noteId) {
            loadNote(noteId)
        }
    }, [])

    const loadNotePre = (noteProps: NoteProps) => {
        if(!noteProps || !noteProps.noteId) {
            setCurrentNote(null)
            setCurrentNoteProps(null)
            return
        }
        setCurrentNoteProps(noteProps)
        const { noteId } = noteProps
        if(getCookieByName(NOTE_ID) === noteId) {
            console.log("Note already loaded")
            return
        }
        loadNote(noteId)
    }

    const loadNote = (noteId: string) => {
        fetch("/api/note?".concat(new URLSearchParams({ noteId }).toString()))
            .then<Note | null>(response => response.json())
            .then(data => {
                if(data === null) {
                    notifications.show({message: "Note not found", color: 'red'})
                    return
                }
                showNote(data)
            }).catch((error) => {
            notifications.show(error)
        })
    }

    const showNote = (note: Note) => {
        setCurrentNote(note)
        addCookie(NOTE_ID, note.noteId)
    }

    const saveNote = (note: Note) => {
        fetch("/api/note", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(note)
        })
            .then(response => response.json())
            .then(data => {
                // setCurrentNote(data)
            }).catch((error) => {
                notifications.show({message: JSON.stringify(error), color: 'red'})
            })
    }

    const onContentChange = (content: string) => {
        if(currentNote) {
            currentNote.content = content
            saveNote(currentNote)
        }
    }

    return (
        <Container h="100%" fluid>
            {currentNote === null ? (
                <Center h="100%" mx="auto">
                    No note selected
                </Center>) : (
                    <MarkdownEditor key={currentNote.noteId} content={currentNote.content} onChange={onContentChange}/>
            )}
        </Container>
    )
}