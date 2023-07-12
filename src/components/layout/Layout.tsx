import {
    AppShell, Skeleton,
    useMantineTheme,
} from '@mantine/core';
import {MainNavBar} from "./MainNavBar";
import React, {useState} from "react";
import MainHeader from "@/components/layout/MainHeader";
interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    // const [pageLoading, setPageLoading] = useState(false);

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
            navbar={<MainNavBar opened={opened} setOpened={setOpened}/>}
            header={<MainHeader opened={opened} setOpened={setOpened}/>}
            h="100%"
        >
            {children}
        </AppShell>
    );
}