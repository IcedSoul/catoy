import {NavbarFileTree} from "@/components/parts/NavbarFileTree";
import React from "react";

interface NavbarNoteProps {
    opened: boolean
    setOpened: (opened: boolean) => void
}

export function NavbarNote({opened, setOpened}: NavbarNoteProps){
    return (
        <NavbarFileTree opened={opened} setOpened={setOpened} type="note"/>
    )
}