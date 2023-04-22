import {
    ActionIcon,
    Code,
    createStyles,
    Group,
    Image,
    Navbar,
    rem,
    Text,
    TextInput,
    Tooltip,
    UnstyledButton
} from "@mantine/core";
import {IconBrandHipchat, IconBrandVscode, IconPlus, IconSearch, IconTrash} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {CHAT_SESSION_ID, ChatSession} from "@/common/client/ChatGPTCommon";
import {addCookie, getCookieByName, removeCookie} from "@/common/client/common";
import {useSessionContext} from "@/components/providers/SessionContextProvider";
import Router from 'next/router'

const useStyles = createStyles((theme) => ({
    navbar: {
        paddingTop: 0,
    },

    search: {
        paddingTop: 10
    },

    section: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        marginBottom: theme.spacing.md,

        '&:not(:last-of-type)': {
            borderBottom: `${rem(1)} solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
        },
    },

    searchCode: {
        fontWeight: 700,
        fontSize: rem(10),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        border: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
        }`,
    },


    mainLinks: {
        paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
        paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
        paddingBottom: theme.spacing.md,
    },

    mainLink: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        fontSize: theme.fontSizes.xs,
        padding: `${rem(8)} ${theme.spacing.xs}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    mainLinkInner: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },

    mainLinkIcon: {
        marginRight: theme.spacing.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    },

    mainLinkBadge: {
        padding: 0,
        width: rem(20),
        height: rem(20),
        pointerEvents: 'none',
    },

    collections: {
        paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingBottom: theme.spacing.md,
    },

    collectionsHeader: {
        paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
        paddingRight: theme.spacing.md,
        marginBottom: rem(5),
    },

    collection: {
        width: '100%',
        padding: `${rem(8)} ${theme.spacing.xs}`,
        textDecoration: 'none',
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.xs,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        lineHeight: 1,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            cursor: 'pointer',
        },
    },

    collectionLink: {
      flexGrow: 1,
    },

    collectionIcon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        flexGrow: 0,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
            color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[8],
        }
    },
}));

const links = [
    { icon: IconBrandHipchat, label: 'ChatGPT', route: '/chat' },
    { icon: IconBrandVscode, label: 'Completion', route: '/completion' },
    // { icon: IconUser, label: 'Contacts' },
];

const toys = [
    { emoji: '👍', label: 'Sales' },
    { emoji: '🚚', label: 'Deliveries' },
    { emoji: '💸', label: 'Discounts' },
    { emoji: '💰', label: 'Profits' },
    { emoji: '✨', label: 'Reports' },
    { emoji: '🛒', label: 'Orders' },
    { emoji: '📅', label: 'Events' },
    { emoji: '🙈', label: 'Debts' },
    { emoji: '💁‍♀️', label: 'Customers' },
];
type NvaBarProps = {
    opened: boolean
    setOpened: (opened: boolean) => void
}

export const MainNavBar = ({ opened, setOpened }: NvaBarProps) => {
    const { classes: styles } = useStyles();
    const [chatSessions, setChatSessions] = useState<Array<ChatSession>>([]);
    const { setRefreshSession, refreshMessages} = useSessionContext()

    useEffect(() => {
        refreshSession()
        setRefreshSession(() => refreshSession)
    }, [])

    const loadSessions = async () => {
        return fetch("/api/chatgpt/session")
            .then(response => response.json())
            .then(sessions => {
                setChatSessions(sessions)
            });
    }

    const refreshSession = () => {
        loadSessions().then()
    }

    const setChatSession = (chatSession?: ChatSession) => {
        if(!chatSession){
            removeCookie(CHAT_SESSION_ID)
        }
        else if(getCookieByName(CHAT_SESSION_ID) !== chatSession.sessionId){
            addCookie(CHAT_SESSION_ID, chatSession.sessionId)
        }
        refreshMessages?.()
    }

    const deleteSession = async (sessionId: string, event: any) => {
        event.stopPropagation()
        return fetch('/api/chatgpt/session?'.concat(new URLSearchParams({ sessionId }).toString()), {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(sessions => {
                setChatSessions(sessions)
                if(getCookieByName(CHAT_SESSION_ID) === sessionId){
                    setChatSession()
                }
            });
    }

    const onChangeRoute = (route: string) => {
        Router.push(route).then()
    }

    const onSelectSession = (session: ChatSession) => {
        setChatSession(session)
        setOpened(!opened)
    }

    const mainLinks = links.map((link) => (
        <UnstyledButton key={link.label} className={styles.mainLink}>
            <div className={styles.mainLinkInner} onClick={() => onChangeRoute(link.route)}>
                <link.icon size={20} className={styles.mainLinkIcon} stroke={1.5} />
                <span>{link.label}</span>
            </div>
        </UnstyledButton>
    ));

    const collectionLinks = chatSessions.map((session) => (
        <Group
            position="apart"
            key={session.sessionId}
            className={styles.collection}
            onClick={() => onSelectSession(session)}
        >
            <a className={styles.collectionLink}>
                <span style={{ marginRight: rem(9), fontSize: rem(16) }}>✨</span>{' '}
                {session.title}
            </a>
            <IconTrash size={16} stroke={1.5} onClick={(event) => deleteSession(session.sessionId, event)} className={styles.collectionIcon} />
        </Group>
    ));

    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 240, lg: 300 }}>
            <Navbar.Section className={styles.search}>
                <TextInput
                    placeholder="Search"
                    size="xs"
                    icon={<IconSearch size="0.8rem" stroke={1.5} />}
                    rightSectionWidth={70}
                    rightSection={<Code className={styles.searchCode}>Search</Code>}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    mb="sm"
                />
            </Navbar.Section>

            <Navbar.Section className={styles.section}>
                <div className={styles.mainLinks}>{mainLinks}</div>
            </Navbar.Section>

            <Navbar.Section className={styles.section}>
                <Group className={styles.collectionsHeader} position="apart">
                    <Text size="xs" weight={500} color="dimmed">
                        Sessions
                    </Text>
                    <Tooltip label="Create new session" withArrow position="right">
                        <ActionIcon variant="default" size={18} onClick={() => setChatSession()}>
                            <IconPlus size="0.8rem" stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
                <div className={styles.collections}>{collectionLinks}</div>
            </Navbar.Section>
        </Navbar>
    );
}