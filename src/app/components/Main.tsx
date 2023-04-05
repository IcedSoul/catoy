'use client';

import {
    AppShell, Burger, Header, MediaQuery, Text,
    useMantineTheme,
} from '@mantine/core';
import MainNavBar from "./layout/MainNavBar";
import ChatGPT from "./functions/ChatGPT";
import React, {useState} from "react";

export default function Main() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: 'calc(100vh - var(--mantine-header-height, 0px))',
                    [theme.fn.smallerThan('sm')]: {
                        paddingTop: `calc(var(--mantine-header-height, 0px) + 0.25rem)`,
                    },
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<MainNavBar opened={opened}/>}
            header={<MediaQuery largerThan="sm" styles={{ display: 'none', height: 0 }}>
                <Header height={{ base: 50, sm: 0 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        <Text>Catoy</Text>
                    </div>
                </Header>
            </MediaQuery>}
            h="100%"
        >
            <ChatGPT/>
        </AppShell>
    );
}