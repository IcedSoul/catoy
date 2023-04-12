'use client';

import {Box, Code, Group, Image, MediaQuery, rem} from "@mantine/core";

export default function CatoyLogo() {
    return (
        <Box>
            <Group position="apart" spacing="xs">
                <Image src="/logo.png" width={rem(120)} alt="logo"/>
                <MediaQuery
                    query="(max-width: 25em)"
                    styles={{ display: 'none' }}
                >
                    <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
                </MediaQuery>
            </Group>
        </Box>
    )
}