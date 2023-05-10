'use client';

import {AuthenticationForm} from "@/components/auth/Authentication";
import {Box, Center} from "@mantine/core";

export default function Page() {
    return (
        <main>
            <Center w="100%" h="80vh" mx="auto">
                <Box w="25%" h="auto" miw="20rem" maw="30rem">
                    <AuthenticationForm/>
                </Box>
            </Center>
        </main>
    )
}