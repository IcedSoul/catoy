import {
    AppShell,
    useMantineTheme,
} from '@mantine/core';
import MainNavBar from "./layout/MainNavBar";
import ChatGPT from "./functions/ChatGPT";
import React, {useState} from "react";
import MainHeader from "@/app/components/layout/MainHeader";
import {ChatSession} from "@/common/ChatGPTCommon";

export default function Main() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);

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
            navbar={<MainNavBar opened={opened} setChatSession={setChatSession}/>}
            header={<MainHeader opened={opened} setOpened={setOpened}/>}
            h="100%"
        >
            <ChatGPT sessionId={chatSession?.sessionId || ""}/>
        </AppShell>
    );
}