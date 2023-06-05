import {
    ActionIcon,
    Avatar,
    Burger, Button, Center, Container,
    createStyles,
    Group,
    Header,
    Menu, Modal,
    rem,
    Text,
    Title,
    UnstyledButton, useMantineColorScheme,
} from "@mantine/core";
import React, {Dispatch, SetStateAction, useState} from "react";
import {
    IconChartPie2,
    IconChevronDown,
    IconLogout,
    IconMoonStars,
    IconSun,
    IconSwitchHorizontal,
} from "@tabler/icons-react";
import {signIn, signOut, useSession} from "next-auth/react";
import CatoyLogo from "@/components/parts/CatoyLogo";
import StatusBar from "@/components/parts/StatusBar";
import {UserUsageLimit} from "@/common/server/repository/Models";
const useStyles = createStyles((theme) => ({
    header: {
        paddingTop: theme.spacing.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
        }`,
        marginBottom: rem(120),
    },

    mainSection: {
        paddingBottom: theme.spacing.sm,
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        // [theme.fn.smallerThan('xs')]: {
        //     display: 'none',
        // },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    usageModalTitle: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    }
}));

const signOutParams = {
    callbackUrl: "/auth/login",
}

type Props = {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

type UserUsageInfo = {
    title: string
    limit: number
    usage: number
    type: "daily" | "total"
}

export default function MainHeader({ opened, setOpened }: Props){
    const {classes, theme, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const [usageModalOpened, setUsageModalOpened] = useState(false);
    const [gpt35UsageInfo, setGpt35UsageInfo] = useState<UserUsageInfo | null>(null)
    const [gpt4UsageInfo, setGpt4UsageInfo] = useState<UserUsageInfo | null>(null)
    const [gpt35TotalUsageInfo, setGpt35TotalUsageInfo] = useState<UserUsageInfo | null>(null)
    const [gpt4TotalUsageInfo, setGpt4TotalUsageInfo] = useState<UserUsageInfo | null>(null)
    const { data: session } = useSession()
    const { user } = session || { user: null }
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const onUsageClick = () => {
        getUsageInfo()
        setUsageModalOpened(true)
    }

    const onUsageClose = () => {
        setUsageModalOpened(false)
    }

    const getUsageInfo = () => {
        fetch('/api/user/usage', {
            method: 'GET',
        }).then<UserUsageLimit>(response => response.json()).then((response) => {
            if(response){
                setGpt35UsageInfo({
                    title: "GPT-3 Daily",
                    limit: response.dailyChatLimit,
                    usage: response.dailyChatUsage,
                    type: "daily"
                })
                setGpt4UsageInfo({
                    title: "GPT-4 Daily",
                    limit: response.dailyGpt4Limit,
                    usage: response.dailyGpt4Usage,
                    type: "daily"
                })
                setGpt35TotalUsageInfo({
                    title: "GPT-3 Total",
                    limit: response.chatLimit,
                    usage: response.chatUsage,
                    type: "total"
                })
                setGpt4TotalUsageInfo({
                    title: "GPT-4 Total",
                    limit: response.gpt4Limit,
                    usage: response.gpt4Usage,
                    type: "total"
                })
            }
        })
    }

    return (
        <Header height={56} className={classes.header}>
            <Container className={classes.mainSection} fluid>
                <Group position="apart" spacing="xs">
                    <Group position="left" spacing="xs">
                        <Burger
                            className={classes.burger}
                            opened={opened}
                            onClick={() => setOpened((o: boolean) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                        />
                        <CatoyLogo/>
                    </Group>
                    <Group position="right" spacing="xs">
                        <ActionIcon
                            onClick={() => toggleColorScheme()}
                            size="lg"
                            sx={(theme) => ({
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                color: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[7],
                            })}
                        >
                            {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
                        </ActionIcon>
                        {
                            session && user ? (
                                <Menu
                                    width={260}
                                    position="bottom-end"
                                    transitionProps={{ transition: 'pop-top-right' }}
                                    onClose={() => setUserMenuOpened(false)}
                                    onOpen={() => setUserMenuOpened(true)}
                                    withinPortal
                                >
                                    <Menu.Target>
                                        <UnstyledButton
                                            className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                        >
                                            <Group spacing={7}>
                                                <Avatar src={user.image} alt={user.name || "avatar"} radius="xl" size={20} />
                                                <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                                    {user.name}
                                                </Text>
                                                <IconChevronDown size={rem(12)} stroke={1.5} />
                                            </Group>
                                        </UnstyledButton>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => onUsageClick()}
                                            icon={<IconChartPie2 size="0.9rem" stroke={1.5} />}
                                        >
                                            Usage
                                        </Menu.Item>
                                        {/*<Menu.Item*/}
                                        {/*    icon={<IconStar size="0.9rem" color={theme.colors.yellow[6]} stroke={1.5} />}*/}
                                        {/*>*/}
                                        {/*    Saved posts*/}
                                        {/*</Menu.Item>*/}
                                        {/*<Menu.Item*/}
                                        {/*    icon={<IconMessage size="0.9rem" color={theme.colors.blue[6]} stroke={1.5} />}*/}
                                        {/*>*/}
                                        {/*    Your comments*/}
                                        {/*</Menu.Item>*/}

                                        {/*<Menu.Label>Settings</Menu.Label>*/}
                                        {/*<Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>*/}
                                        {/*    Account settings*/}
                                        {/*</Menu.Item>*/}
                                        <Menu.Item onClick={() => signOut(signOutParams)} icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}>
                                            Change account
                                        </Menu.Item>
                                        <Menu.Item onClick={() => signOut(signOutParams)} icon={<IconLogout size="0.9rem" stroke={1.5} />}>
                                            Logout
                                        </Menu.Item>
                                    </Menu.Dropdown>

                                    <Modal opened={usageModalOpened} onClose={onUsageClose} size="auto" title="Usage Status" centered>
                                        <Center className={classes.usageModalTitle}>
                                            <Title order={3}>Daily Usage</Title>
                                        </Center>
                                        <Group position="center" spacing="xs">
                                            <StatusBar {...gpt35UsageInfo}/>
                                            <StatusBar {...gpt4UsageInfo}/>
                                        </Group>
                                        <Center className={classes.usageModalTitle}>
                                            <Title order={3}>Total Usage</Title>
                                        </Center>
                                        <Group position="center" spacing="xs">
                                            <StatusBar {...gpt35TotalUsageInfo}/>
                                            <StatusBar {...gpt4TotalUsageInfo}/>
                                        </Group>
                                    </Modal>
                                </Menu>
                            ) : (
                                <Button onClick={() => signIn()} variant="outline" color={colorScheme === "dark" ? "gray": "dark"} radius="lg">Login</Button>
                            )
                        }
                    </Group>
                </Group>
            </Container>
        </Header>
    )
}