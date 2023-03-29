'use client';

import {
    AppShell,
    Text,
    useMantineTheme,
} from '@mantine/core';
import MainNavBar from "./layout/MainNavBar";
import ChatGPT from "./functions/ChatGPT";

export default function Main() {
    const theme = useMantineTheme();
    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<MainNavBar/>}
        >
            <ChatGPT/>
        </AppShell>
    );
}