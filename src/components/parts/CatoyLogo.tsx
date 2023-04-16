'use client';

import {Box, Code, Group, Image, MediaQuery, rem, useMantineColorScheme} from "@mantine/core";

export default function CatoyLogo() {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Box>
            <Group position="apart" spacing="xs">
                <Image src={colorScheme === "dark" ? "/logo-white.png" : "/logo.png"} width={rem(120)} alt="logo"/>
                <MediaQuery
                    query="(max-width: 30em)"
                    styles={{ display: 'none' }}
                >
                    <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
                </MediaQuery>
            </Group>
        </Box>
    )
}