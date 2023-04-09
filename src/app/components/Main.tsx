'use client';

import {
    AppShell, Burger, Header, MediaQuery, Text,
    useMantineTheme,
} from '@mantine/core';
import MainNavBar from "./layout/MainNavBar";
import ChatGPT from "./functions/ChatGPT";
import React, {useState} from "react";
import MainHeader from "@/app/components/layout/MainHeader";

const user = {
    name: 'xiaofeng',
    image: 'https://avatars.githubusercontent.com/u/25154432?v=4',
}

export default function Main() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

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
            navbar={<MainNavBar opened={opened}/>}
            header={<MainHeader opened={opened} setOpened={setOpened} user={user}/>}
            h="100%"
        >
            <ChatGPT/>
        </AppShell>
    );
}