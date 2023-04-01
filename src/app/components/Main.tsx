'use client';

import {
    AppShell,
    useMantineTheme,
} from '@mantine/core';
import MainNavBar from "./layout/MainNavBar";
import ChatGPT from "./functions/ChatGPT";
import React from "react";

export default function Main() {
    const theme = useMantineTheme();
    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: '100vh'
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<MainNavBar/>}
            h="100%"
        >
            <ChatGPT/>
        </AppShell>
    );
}