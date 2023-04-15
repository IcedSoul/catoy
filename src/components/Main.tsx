import {
    AppShell,
    useMantineTheme,
} from '@mantine/core';
import {MainNavBar} from "./layout/MainNavBar";
import {ChatGPT} from "./functions/ChatGPT";
import React, {useRef, useState} from "react";
import MainHeader from "@/components/layout/MainHeader";
import {CHAT_SESSION_ID, ChatGPTRef, ChatSession, NavBarRef} from "@/common/client/ChatGPTCommon";
import {addCookie, getCookieByName} from "@/common/client/common";
import {deleteCookie} from "cookies-next";

export default function Main() {
    const theme = useMantineTheme();
    const chatGPT = useRef<ChatGPTRef>(null)
    const navBar = useRef<NavBarRef>(null)

    const [opened, setOpened] = useState(false);

    const onSessionSelected = (session?: ChatSession) => {
        if(session && getCookieByName(CHAT_SESSION_ID) === session.sessionId) return
        session ? addCookie(CHAT_SESSION_ID, session.sessionId) : deleteCookie(CHAT_SESSION_ID)
        chatGPT.current?.loadMessages().then()
    }

    const loadSession = () => {
        navBar.current?.loadSessions().then()
    }

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: 'calc(100vh - var(--mantine-header-height, 0px))',
                    paddingTop: `calc(var(--mantine-header-height, 0px) + 0.25rem)`,
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<MainNavBar opened={opened} setChatSession={onSessionSelected} ref={navBar}/>}
            header={<MainHeader opened={opened} setOpened={setOpened}/>}
            h="100%"
        >
            <ChatGPT ref={chatGPT} loadSession={loadSession}/>
        </AppShell>
    );
}