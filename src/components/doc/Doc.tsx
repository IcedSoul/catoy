import {Center, Container} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {MarkdownEditor} from "@/components/util/MarkdownEditor";
import {useGlobalContext} from "@/components/providers/GlobalContextProvider";
import {NoteProps} from "@/common/client/CompleteCommon";
import {Note} from "@/common/server/repository/Models";
import {notifications} from "@mantine/notifications";

export const Doc = () => {
    const [currentNote, setCurrentNote] = useState<Note | null>(null)
    const { setRefreshNote } = useGlobalContext()

    useEffect(() => {
        setRefreshNote(() => loadNote)
    }, [])

    const loadNote = (noteProps: NoteProps) => {
        if(currentNote && currentNote.noteId === noteProps.noteId) {
            return
        }
        fetch("/api/note?".concat(new URLSearchParams({ noteId: noteProps.noteId }).toString()))
            .then<Note | null>(response => response.json())
            .then(data => {
                setCurrentNote(data)
            }).catch((error) => {
                notifications.show(error)
            })
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
                setCurrentNote(data)
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
                    <MarkdownEditor content={currentNote.content} onChange={onContentChange}/>
            )}

        </Container>
    )
}