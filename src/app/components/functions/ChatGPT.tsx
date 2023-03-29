'use client';

import {
    ActionIcon,
    Container,
    Flex,
    Grid,
    rem,
    Stack,
    Textarea,
    Paper,
    createStyles, ThemeIcon, Space, Select, SelectItem
} from '@mantine/core';

import {IconBrandOpenai, IconBrandTelegram, IconUfo} from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import './markdown-styles.css'
import {Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

import React, {useEffect, useState, use} from "react";
import {CodeProps} from "react-markdown/lib/ast-to-react";
import {ChatMessage, MessageSource} from "@/common/ChatGPTCommon";
import {Model} from "openai/api";

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        width: '100%',
        transition: 'transform 150ms ease, box-shadow 100ms ease',
        padding: theme.spacing.lg,
        paddingLeft: `calc(${theme.spacing.lg} * 2)`,

        '&:hover': {
            boxShadow: theme.shadows.md,
            transform: 'scale(1.001)',
        },
    },
    cardLeft: {
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: rem(6),
            backgroundImage: theme.fn.linearGradient(0, theme.colors.cyan[3], theme.colors.teal[6]),
        },
    },
    cardRight: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: rem(6),
            backgroundImage: theme.fn.linearGradient(0, theme.colors.gray[5], theme.colors.dark[7]),
        },
    },

    iconColorLeft: {
        deg: 0,
        from: 'cyan',
        to: 'teal'
    },

    iconColorRight: {
        deg: 0,
        from: 'dark',
        to: 'gray'
    }
}));

const getMessages = async () => {
    return await fetch("/api/chatgpt/message")
        .then<Array<ChatMessage>>(response => response.json())
}

const getModels = async () => {
    return fetch("/api/openai/models")
        .then<Array<Model>>(response => response.json())
}

const fetchMap = new Map<string, any>();
function queryClient<QueryResult>(
    name:string,
    query: () => Promise<QueryResult>
) :Promise<QueryResult> {
    if(!fetchMap.has(name)){
        fetchMap.set(name, query())
    }
    return fetchMap.get(name)
}

export default function ChatGPT() {
    const { classes, cx } = useStyles()
    // const [messages, setMessages] = useState<Array<ChatMessage>>([])
    // const [models, setModels] = useState<Array<Model>>([])
    const messages = use(queryClient<Array<ChatMessage>>("messages", getMessages))
    const models = use(queryClient<Array<Model>>("models", getModels))

    useEffect(() => {
        console.log("xiaofeng")
    })

    const modelLists:Array<SelectItem> = models.map((model) => {return { label: model.id, value: model.id }})
    const currentModel: SelectItem | null = modelLists.at(0) || null

    const messageContents = messages.map((message, key) => (
        <Paper
            withBorder
            radius="md"
            key={key}
            className={
            cx(
                classes.card,
                {
                    [classes.cardLeft]: message.from === MessageSource.CHAT_GPT,
                    [classes.cardRight]: message.from === MessageSource.ME
                }
                )
            }
        >
            <Flex
                gap="md"
                justify={message.from === MessageSource.CHAT_GPT ? "left" : "right"}
                align="flex-start"
                direction={message.from === MessageSource.CHAT_GPT ? "row" : "row-reverse"}
            >
                {
                    message.from === MessageSource.CHAT_GPT ? (
                        <ThemeIcon
                            size="xl"
                            radius="md"
                            variant="gradient"
                            gradient={{ deg: 0, from: 'cyan', to: 'teal' }}
                        >
                            <IconBrandOpenai size={rem(20)} stroke={1.5} />
                        </ThemeIcon>
                    ) : (
                        <ThemeIcon
                            size="xl"
                            radius="md"
                            variant="gradient"
                            gradient={{ deg: 0, from: 'dark', to: 'gray' }}
                        >
                            <IconUfo size={rem(20)} stroke={1.5} />
                        </ThemeIcon>
                    )
                }
                <Container fluid>
                    <ReactMarkdown
                        className="markdown-body"
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({node, inline, className, children, style, ...props}: CodeProps) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={ tomorrow }
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </Container>
                <Space w="lg"/>
            </Flex>
        </Paper>
    ));

    return (
        <Container h="100%">
            <Stack
                h="100%"
                justify="center"
                align="center"
            >
                <Stack
                    h="50"
                    w="100%"
                    align="center"
                >
                    <Select
                        w="80%"
                        label="Model"
                        defaultValue={currentModel?.value}
                        data={modelLists}
                    />
                </Stack>
                <Stack
                    h="100%"
                    justify="flex-end"
                    align="flex-end"
                >
                    <Stack justify="flex-end" align="self-start" w="100%" h="100%">
                        {messageContents}
                    </Stack>
                    <Grid justify="center" align="center" w="100%" grow>
                        <Grid.Col span={11}>
                            <Textarea
                                placeholder="Ask ChatGPT"
                                autosize
                                minRows={1}
                                maxRows={10}
                            />
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <ActionIcon variant="filled" size="2rem" w="100%">
                                <IconBrandTelegram size="1rem" />
                            </ActionIcon>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Stack>
        </Container>
    )
}