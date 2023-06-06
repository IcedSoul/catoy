import {
    ActionIcon,
    Container,
    createStyles,
    Flex,
    Grid,
    Loader,
    Paper,
    rem,
    ScrollArea,
    Select,
    SelectItem,
    Space,
    Stack,
    Textarea,
    ThemeIcon, useMantineColorScheme
} from '@mantine/core';

import {IconBrandOpenai, IconBrandTelegram, IconUfo} from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import './markdown-styles.css'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {tomorrow} from 'react-syntax-highlighter/dist/cjs/styles/prism'

import React, { useEffect, useRef, useState} from "react";
import {CodeProps} from "react-markdown/lib/ast-to-react";
import {
    CHAT_SESSION_ID,
    ChatMessage,
    decoder,
    HttpMethod,
    MessageSource
} from "@/common/client/ChatGPTCommon";
import {getCookieByName, removeCookie} from "@/common/client/common";
import {useGlobalContext} from "@/components/providers/GlobalContextProvider";
import {notifications} from "@mantine/notifications";

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

        [theme.fn.smallerThan('lg')]: {
            padding: theme.spacing.md,
            paddingLeft: `calc(${theme.spacing.md} * 2)`,
        },
        [theme.fn.smallerThan('md')]: {
            padding: theme.spacing.sm,
            paddingLeft: `calc(${theme.spacing.sm} * 2)`,
        },
        [theme.fn.smallerThan('sm')]: {
            padding: theme.spacing.xs,
            paddingLeft: `calc(${theme.spacing.xs} * 1.5)`,
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
            [theme.fn.smallerThan('sm')]: {
                width: rem(4),
            },
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
            [theme.fn.smallerThan('sm')]: {
                width: rem(4),
            },
        },
    },
    iconBox: {
        width: '2.5rem',
        height: '2.5rem',
        maxHeight: '2.5rem',
        maxWidth: '2.5rem',
        borderRadius: '0.5rem',
        [theme.fn.smallerThan('sm')]: {
            width: '1.5rem',
            height: '1.5rem',
            maxHeight: '1.5rem',
            maxWidth: '1.5rem',
            borderRadius: '0.25rem',
        },
    },
    icon: {
        width: '1.25rem',
        height: '1.25rem',
        [theme.fn.smallerThan('sm')]: {
            width: '1.0rem',
            height: '1.0rem',
        },
    },
    chatArea: {
        flexGrow: 1,
        overflow: "hidden"
    },
    cursorPointer: {
        margin: "auto 0",
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        animation: 'cursorPointerBlink 0.5s infinite',
        '@keyframes cursorPointerBlink': {
            '50%': { opacity: 0 },
        }
    },
}));

interface ChatGPTProps {
}

export const ChatGPT = ({}: ChatGPTProps) => {
    const { classes, cx } = useStyles()
    const messageTextArea = useRef<HTMLTextAreaElement>(null)
    const [currentModel, setCurrentModel] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<ChatMessage>>([])
    const [modelLists, setModelLists] = useState<Array<SelectItem>>([])
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState<ChatMessage>();
    const [inputMessage, setInputMessage] = useState<string>("");
    const scroll = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { colorScheme } = useMantineColorScheme();
    const { refreshSession, setRefreshMessages } = useGlobalContext()

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

        getModels().then((models) => {
            setCurrentModel(models.at(0)?.value || null)
            setModelLists(models)
        })

        refreshSession?.()
        setRefreshMessages(() => refreshMessages)
        loadMessages().then()
    }, [])

    const refreshMessages = () => {
        loadMessages().then()
        setInputMessage("")
    }

    const loadMessages = async () => {
        const sessionId = getCookieByName(CHAT_SESSION_ID)
        if(!sessionId){
            setMessages([])
            return
        }
        fetch("/api/chatgpt/message?".concat(new URLSearchParams({ sessionId }).toString()))
            .then<Array<ChatMessage>>(response => response.json()).then((messages) => {
            setMessages(messages)
            if(messages && messages.length > 0){
                const message = messages[0]
                setCurrentModel(message?.model || null)
            }
            setTimeout(() => scrollToBottom("smooth"), 100)
        })
    }

    const sendMessage = async (model: string, message: ChatMessage) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const body = {
            model,
            message,
            sessionId: getCookieByName(CHAT_SESSION_ID)
        }
        const requestInit: RequestInit = {
            method: HttpMethod.POST,
            headers,
            body: JSON.stringify(body)
        }
        const response = await fetch("api/openai/message", requestInit).then(response => response.body).catch(() => {
            notifications.show({
                title: 'Server error',
                message: "Please try again later or start a new session.",
                color: 'red'
            })
        })
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
                setIsLoading(false)
                refreshSession?.()
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

    const onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(event.target.value)
    }

    const onTextAreaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === 'Enter' && (event.shiftKey || event.ctrlKey)){
            event.preventDefault()
            setInputMessage(inputMessage.concat('\n'))
        } else if(event.key === 'Enter'){
            event.preventDefault()
            onSendMessage()
        }
    }

    const onSendMessage = () => {
        const message = inputMessage.trim()
        if(!message) { return }
        messageTextArea.current ? messageTextArea.current.value = '' : null
        const sendChatMessage: ChatMessage = {
            role: MessageSource.USER,
            content: message
        }
        setInputMessage("")
        setMessages((prev) => [...messages, sendChatMessage])
        currentModel ? sendMessage(currentModel, sendChatMessage) : null
        setIsLoading(true)
        setCurrentLoadingMessage({
            role: MessageSource.ASSISTANT,
            content: ""
        })
        setTimeout(() => scrollToBottom(), 50)
    }

    const onModelChanged = (model: string) => {
        removeCookie(CHAT_SESSION_ID)
        refreshMessages()
        setCurrentModel(model)
    }

    const scrollToBottom = (behavior: ScrollBehavior = 'auto') =>
        scroll.current?.scrollTo({ top: scroll.current?.scrollHeight, behavior });


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
                gap={{ base: '0.5rem', lg: 'lg', md: 'md', sm: 'sm', xs: 'xs' }}
                justify={message?.role === MessageSource.ASSISTANT ? "left" : "right"}
                align={message?.role === MessageSource.ASSISTANT ? "flex-start" : "flex-end"}
                direction={message?.role === MessageSource.ASSISTANT ? { base: 'column', xs: 'row'} : { base: 'column', xs: 'row-reverse'}}
            >
                {
                    message?.role === MessageSource.ASSISTANT ? (
                        <ThemeIcon
                            className={classes.iconBox}
                            variant="gradient"
                            gradient={{ deg: 0, from: 'cyan', to: 'teal' }}
                        >
                            {
                                isLoading && key >= messages.length ? (
                                    <Loader color="gray.0" size="xs" variant="dots" />
                                ) : (
                                    <IconBrandOpenai className={classes.icon} size={rem(20)} stroke={1.5} />
                                )
                            }
                        </ThemeIcon>
                    ) : (
                        <ThemeIcon
                            className={classes.iconBox}
                            variant="gradient"
                            gradient={{ deg: 0, from: 'dark', to: 'gray' }}
                        >
                            <IconUfo className={classes.icon} size={rem(20)} stroke={1.5} />
                        </ThemeIcon>
                    )
                }
                <Flex
                    w="100%"
                    align="flex-start"
                    justify={message?.role === MessageSource.ASSISTANT ? "flex-start" : "flex-end"}
                    wrap="wrap"
                >
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <ReactMarkdown children={ message?.content || ""}
                        // className={classes.markdownBody}
                        className={`markdown-body ${colorScheme}`}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({node, inline, className, children, style, ...props}: CodeProps) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={ tomorrow }
                                        language={match[1]}
                                        showLineNumbers
                                        wrapLines
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
                    {/*{(isLoading && key >= messages.length) || true ? (<IconCursorText size={22} stroke={1.5} className={classes.cursorPointer}/>) : null}*/}
                </Flex>
                <Space w="lg"/>
            </Flex>
        </Paper>
    ));

    return (
        <Container h="100%" size="lg" pl="0" pr="0">
            <Stack
                h="100%"
                justify="space-between"
                align="center"
                spacing="sm"
            >
                <Stack
                    w="100%"
                    align="center"
                >
                    <Select
                        w="80%"
                        label="Model"
                        value={currentModel || modelLists?.[0]?.value}
                        data={modelLists || []}
                        size="sm"
                        onChange={onModelChanged}
                    />
                </Stack>
                <Stack
                    w="100%"
                    justify="flex-end"
                    align="flex-end"
                    spacing="lg"
                    className={classes.chatArea}
                >
                    <ScrollArea.Autosize h="100%" w="100%" viewportRef={scroll} scrollHideDelay={0}>
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
                            disabled={isLoading}
                            ref={messageTextArea}
                            placeholder="Ask ChatGPT (Enter or click Send Icon to send message)"
                            autosize
                            minRows={1}
                            maxRows={10}
                            value={inputMessage}
                            onChange={onTextAreaChange}
                            onKeyDown={onTextAreaKeyDown}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <ActionIcon variant="filled" size="2rem" w="100%" onClick={onSendMessage} disabled={isLoading}>
                            <IconBrandTelegram size="1rem" />
                        </ActionIcon>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    )
}