import {
    ActionIcon,
    Container, CopyButton,
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
    ThemeIcon, Tooltip, useMantineColorScheme
} from '@mantine/core';

import {
    IconBrandOpenai,
    IconBrandTelegram, IconCheck,
    IconClearFormatting, IconCopy,
    IconRefresh,
    IconUfo
} from "@tabler/icons-react";
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
    HttpMethod, markdownLineFeedAdapter,
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
    scrollArea: {
        width: '100%',
        "> div": {
            width: '100%',
        },
        ".mantine-ScrollArea-root": {
            width: '100%',
        },
        ".mantine-ScrollArea-viewport > div": {
            width: '100%',
            display: 'block!important',
        },
    },
    chatArea: {
        flexGrow: 1,
        overflow: "hidden"
    },
    chatText: {
        wordBreak: "break-all",
        overflowWrap: "break-word",
        overflow: "hidden",
    },
    cursorPointer: {
        margin: "auto 0",
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        animation: 'cursorPointerBlink 0.5s infinite',
        '@keyframes cursorPointerBlink': {
            '50%': { opacity: 0 },
        }
    },
    bottomIcon: {
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.xs,
    },
    copyButton: {
        float: "right",
    }
}));

tomorrow['pre[class*="language-"]']['overflow'] = "hidden";

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

    const sendMessage = async (model: string, message: ChatMessage, reGenerate: boolean = false) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const body = {
            model,
            message,
            sessionId: getCookieByName(CHAT_SESSION_ID),
            reGenerate
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
                setTimeout(() => scrollToBottom(), 50)
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
            const selectionStart = event.currentTarget.selectionStart
            const selectionEnd = event.currentTarget.selectionEnd
            setInputMessage(inputMessage.substring(0, selectionStart).concat('\n', inputMessage.substring(selectionEnd)))
            const textArea = event.currentTarget
            const position = selectionStart + 1
            setTimeout(() => {
                textArea.setSelectionRange(position, position)
            })

        } else if(event.key === 'Enter'){
            event.preventDefault()
            onSendMessage()
        }
    }

    const onSendMessage = () => {
        const message = markdownLineFeedAdapter(inputMessage.trim())
        if(!message) { return }
        messageTextArea.current ? messageTextArea.current.value = '' : null
        const sendChatMessage: ChatMessage = {
            role: MessageSource.USER,
            content: message
        }
        setInputMessage("")
        setMessages((prev) => [...messages, sendChatMessage])
        setIsLoading(true)
        currentModel ? sendMessage(currentModel, sendChatMessage) : null
        setCurrentLoadingMessage({
            role: MessageSource.ASSISTANT,
            content: ""
        })
        setTimeout(() => scrollToBottom(), 50)
    }

    const onReGenerateMessage = () => {
        if(messages.length < 2){
            return
        }
        const message = messages[messages.length - 2]
        if (message.role !== MessageSource.USER){
            return
        }
        setMessages((prev) => [...messages.slice(0, -1)])
        setIsLoading(true)
        currentModel ? sendMessage(currentModel, message, true) : null
        setCurrentLoadingMessage({
            role: MessageSource.ASSISTANT,
            content: ""
        })
        setTimeout(() => scrollToBottom(), 50)
    }

    const onClearMessages = () => {
        setMessages([])
        removeCookie(CHAT_SESSION_ID)
        refreshSession?.()
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
                w="100%"
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
                    className={classes.chatText}
                >
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <ReactMarkdown children={ message?.content || ""}
                        className={`markdown-body ${colorScheme}`}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({node, inline, className, children, style, ...props}: CodeProps) {
                                const match = /language-(\w+)/.exec(className || '')
                                return (
                                    <>
                                        {
                                            !inline && match ? (
                                                <div>
                                                    <CopyButton value={children.toString()}>
                                                        {({ copied, copy }) => (
                                                            <Tooltip label={copied ? 'Copied' : 'Copy'} color={copied ? "teal" : "#2C2E33"} withArrow position="right">
                                                                <ActionIcon className={classes.copyButton} variant="transparent" size="2rem" onClick={copy} disabled={isLoading}>
                                                                    {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                    </CopyButton>
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
                                                </div>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    </>
                                )
                            }
                        }}
                    />
                    {/*{(isLoading && key >= messages.length) || true ? (<IconCursorText size={22} stroke={1.5} className={classes.cursorPointer}/>) : null}*/}
                </Flex>
                {
                    message?.role === MessageSource.ASSISTANT && !isLoading && key >= messages.length - 1 ? (
                        <Tooltip label={"Regenerate"}>
                            <ThemeIcon
                                variant="gradient"
                                gradient={{ deg: 0, from: 'dark', to: 'dark' }}
                                onClick={onReGenerateMessage}
                            >
                                <IconRefresh className={classes.icon} size={rem(20)} stroke={1.5} />
                            </ThemeIcon>
                        </Tooltip>
                    ): (<Space w="lg"/>)
                }
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
                    <ScrollArea.Autosize
                        h="100%"
                        w="100%"
                        viewportRef={scroll}
                        scrollHideDelay={0}
                        className={classes.scrollArea}
                        >
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
                            minRows={3}
                            maxRows={10}
                            value={inputMessage}
                            onChange={onTextAreaChange}
                            onKeyDown={onTextAreaKeyDown}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Flex direction="column" align="center" justify="center" gap="xs">
                            <Tooltip label="Send Message">
                                <ActionIcon variant="gradient" size="2rem" w="100%" onClick={onSendMessage} disabled={isLoading}>
                                    <IconBrandTelegram size="1rem" />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Clear History Message">
                                <ActionIcon variant="filled" size="2rem" w="100%" onClick={onClearMessages} disabled={isLoading}>
                                    <IconClearFormatting size="1rem" />
                                </ActionIcon>
                            </Tooltip>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    )
}