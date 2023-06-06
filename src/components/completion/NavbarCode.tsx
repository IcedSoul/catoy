import React from "react";
import '@sinm/react-file-tree/icons.css';
import '@/components/completion/FileTree.css';
import {NavbarFileTree} from "@/components/parts/NavbarFileTree";

interface NavbarCodeProps {
    opened: boolean
    setOpened: (opened: boolean) => void
}

export function NavbarCode({opened, setOpened}: NavbarCodeProps){
    return (
        <NavbarFileTree opened={opened} setOpened={setOpened} type="code"/>
    )
}