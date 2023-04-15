'use client';

import {AuthenticationForm} from "@/app/components/functions/Authentication";
import {Box, Center} from "@mantine/core";
import {Suspense} from "react";

export default function Login() {
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