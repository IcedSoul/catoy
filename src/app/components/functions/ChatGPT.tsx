'use client';

import {
    ActionIcon,
    Container,
    createStyles,
    Flex,
    Grid,
    Paper,
    rem, ScrollArea,
    Select,
    SelectItem,
    Space,
    Stack,
    Textarea,
    ThemeIcon
} from '@mantine/core';

import {IconBrandOpenai, IconBrandTelegram, IconUfo} from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import './markdown-styles.css'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism'

import React, {useEffect, useRef, useState} from "react";
import {CodeProps} from "react-markdown/lib/ast-to-react";
import {ChatMessage, decoder, HttpMethod, MessageSource} from "@/common/ChatGPTCommon";

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
    },
}));

export default function ChatGPT() {
    const { classes, cx } = useStyles()
    const messageTextArea = useRef<HTMLTextAreaElement>(null)
    const [currentModel, setCurrentModel] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<ChatMessage>>([])
    const [modelLists, setModelLists] = useState<Array<SelectItem>>([])
    const [currentLoadingMessage , setCurrentLoadingMessage] = useState<ChatMessage>();
    const scroll = useRef<HTMLDivElement>(null);
    // const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        const getModels = async () => {
            return await fetch("/api/openai/models?".concat(new URLSearchParams({ type: 'chat' }).toString()))
                .then<Array<string>>(response => response.json())
                .then<Array<SelectItem>>(models => {
                    return models.map(model => {
                        return {label: model, value: model}
                    })
                })
        }
        const getMessages = async () => {
            return await fetch("/api/chatgpt/message")
                .then<Array<ChatMessage>>(response => response.json())

        }
        getModels().then((models) => {
            setCurrentModel(models.at(0)?.value || null)
            setModelLists(models)
        })
        getMessages().then(setMessages)
    }, [])

    const sendMessage = async (model: string, message: ChatMessage) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const body = {
            model,
            message
        }
        const requestInit: RequestInit = {
            method: HttpMethod.POST,
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch("api/openai/message", requestInit).then(response => response.body)
        if(!response) return
        const reader = response.getReader()
        const resMessage: ChatMessage = {
            role: MessageSource.ASSISTANT,
            content: ''
        }
        while (true){
            const {done, value } = await reader.read()
            if(done){
                setMessages((prev) => [...prev, resMessage])
                setCurrentLoadingMessage(undefined)
                break
            }
            resMessage.content = resMessage.content.concat(decoder.decode(value))
            setCurrentLoadingMessage({
                role: resMessage.role,
                content: resMessage.content
            })
            scrollToBottom()
        }
    }

    const onTextAreaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === 'Enter'){
            event.preventDefault()
            onSendMessage()
        }
    }

    const onSendMessage = () => {
        const message = messageTextArea.current?.value
        if(!message) { return }
        messageTextArea.current ? messageTextArea.current.value = '' : null
        const sendChatMessage: ChatMessage = {
            role: MessageSource.USER,
            content: message
        }
        setMessages((prev) => [...messages, sendChatMessage])
        currentModel ? sendMessage(currentModel, sendChatMessage) : null
        scrollToBottom()
    }

    const scrollToBottom = () =>
        scroll.current?.scrollTo({ top: scroll.current?.scrollHeight, behavior: 'auto' });

    const messageContents = [...messages, currentLoadingMessage].filter(message => message).map((message, key) => (
        <Paper
            withBorder
            radius="md"
            key={key}
            className={
            cx(
                classes.card,
                {
                    [classes.cardLeft]: message?.role === MessageSource.ASSISTANT,
                    [classes.cardRight]: message?.role === MessageSource.USER
                }
                )
            }
        >
            <Flex
                gap="md"
                justify={message?.role === MessageSource.ASSISTANT ? "left" : "right"}
                align="flex-start"
                direction={message?.role === MessageSource.ASSISTANT ? "row" : "row-reverse"}
            >
                {
                    message?.role === MessageSource.ASSISTANT ? (
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
                <Flex
                    w="100%"
                    align="flex-start"
                    justify={message?.role === MessageSource.ASSISTANT ? "flex-start" : "flex-end"}
                    wrap="wrap"
                >
                    <ReactMarkdown
                        children={ message?.content || ""}
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
                    />
                </Flex>
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
                    w="100%"
                    align="center"
                >
                    <Select
                        w="80%"
                        label="Model"
                        value={currentModel}
                        data={modelLists || []}
                        onChange={setCurrentModel}
                    />
                </Stack>
                <Stack
                    h="calc(90% - 2rem)"
                    w="100%"
                    justify="flex-end"
                    align="flex-end"
                    spacing="lg"
                >
                    <ScrollArea.Autosize h="100%" w="100%" viewportRef={scroll}>
                        <Stack justify="flex-end" align="self-start" w="100%" h="100%">
                                {messageContents}
                        </Stack>
                    </ScrollArea.Autosize>
                </Stack>
                <Grid
                    justify="center"
                    align="center"
                    w="100%"
                    grow
                >
                    <Grid.Col span={11}>
                        <Textarea
                            ref={messageTextArea}
                            placeholder="Ask ChatGPT (Alt + Enter or Click Send Icon to send message)"
                            autosize
                            minRows={1}
                            maxRows={10}
                            onKeyDown={onTextAreaKeyDown}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ActionIcon variant="filled" size="2rem" w="100%" onClick={onSendMessage}>
                            <IconBrandTelegram size="1rem" />
                        </ActionIcon>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    )
}