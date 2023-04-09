'use client';

import {Box, Code, Group, Image, rem} from "@mantine/core";

export default function CatoyLogo() {
    return (
        <Box>
            <Group position="apart">
                <Image src="/logo.png" width={rem(120)} alt="logo"/>
                <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
            </Group>
        </Box>
    )
}