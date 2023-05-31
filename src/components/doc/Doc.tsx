import {Center, Container} from "@mantine/core";
import React from "react";
import {MarkdownEditor} from "@/components/util/MarkdownEditor";

export const Doc = () => {

    const [currentDoc, setCurrentDoc] = React.useState();

    return (
        <Container h="100%" fluid>
            {currentDoc === null ? (
                <Center h="100%" mx="auto">
                    No note selected
                </Center>) : (
                    <MarkdownEditor/>
            )}

        </Container>
    )
}