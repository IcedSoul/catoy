import {
    AppShell,
    Button,
    Image,
    Text,
    Container,
    createStyles,
    Group,
    List,
    rem,
    ThemeIcon,
    Title,
    useMantineTheme, useMantineColorScheme
} from "@mantine/core";
import React, {useState} from "react";
import MainHeader from "@/components/layout/MainHeader";
import {IconCheck} from "@tabler/icons-react";
import {signIn} from "next-auth/react";
import Router from "next/router";

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: `calc(${theme.spacing.xl} * 4)`,
        paddingBottom: `calc(${theme.spacing.xl} * 4)`,
    },

    content: {
        maxWidth: rem(480),
        marginRight: `calc(${theme.spacing.xl} * 2)`,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: rem(44),
        lineHeight: 1.2,
        fontWeight: 900,

        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,
        cursor: 'pointer',
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    highlight: {
        position: 'relative',
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        borderRadius: theme.radius.sm,
        padding: `${rem(4)} ${rem(12)}`,
    },
}));

export const HomeIndex = () => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);

    const toChat = () => {
        Router.push('/chat');
    }


    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: 'calc(100vh - var(--mantine-header-height, 0px))',
                    paddingTop: `calc(var(--mantine-header-height, 0px) + 0.25rem)`,
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            header={<MainHeader opened={opened} setOpened={setOpened}/>}
            h="100%"
        >
            <div>
                <Container size="xl">
                    <div className={classes.inner}>
                        <div className={classes.content}>
                            <Title className={classes.title}>
                                <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                                    Catoy
                                </Text>{' '} Some  <br /> interesting toys
                            </Title>
                            <Text color="dimmed" mt="md">
                                A interesting AI-based toolsets that can help you be more productive
                            </Text>

                            <List
                                mt={30}
                                spacing="sm"
                                size="sm"
                                icon={
                                    <ThemeIcon size={20} radius="xl">
                                        <IconCheck size={rem(12)} stroke={1.5} />
                                    </ThemeIcon>
                                }
                            >
                                <List.Item>
                                    <b>Chat</b> – Supports chatting with multiple models like {"OpenAI's"} ChatGPT-3.5 and <strong>ChatGPT-4</strong>, featuring code highlighting and conversation management.
                                </List.Item>
                                <List.Item>
                                    <b>Code</b> – Supports AI-based code generation and completion, and can share the code with others. At the same time, it supports syntax prompts and highlighting of multiple programming languages, which is convenient for writing lightweight code examples online.
                                </List.Item>
                                <List.Item>
                                    <b>Note</b> – Supports AI-based text content generation and completion, provides a rich text editor that supports Markdown syntax, and provides document management and sharing functions.
                                </List.Item>
                                <List.Item>
                                    <b>Applications</b> – Some AI-based small applications, such as role-playing chatbots, picture generation, string processing and formatting, etc.
                                </List.Item>
                            </List>

                            <Group mt={30}>
                                <Button radius="xl" size="md" className={classes.control} onClick={toChat}>
                                    Try it
                                </Button>
                                {/*<Button variant="default" radius="xl" size="md" className={classes.control}>*/}
                                {/*    Source code*/}
                                {/*</Button>*/}
                            </Group>
                        </div>
                        <Image src={colorScheme === "dark" ? "/chat.png" : "/chat-white.png"} width={rem(800)} className={classes.image} onClick={toChat} />
                    </div>
                </Container>
            </div>
        </AppShell>
    )
}