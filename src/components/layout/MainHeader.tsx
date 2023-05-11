import {
    ActionIcon,
    Avatar,
    Burger, Button, Container,
    createStyles,
    Group,
    Header,
    Menu,
    rem,
    Text,
    UnstyledButton, useMantineColorScheme,
} from "@mantine/core";
import React, {Dispatch, SetStateAction, useState} from "react";
import {
    IconChevronDown,
    IconHeart, IconLogout,
    IconMessage, IconMoonStars,
    IconSettings,
    IconStar, IconSun,
    IconSwitchHorizontal,
} from "@tabler/icons-react";
import {signIn, signOut, useSession} from "next-auth/react";
import CatoyLogo from "@/components/parts/CatoyLogo";
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
}));

type Props = {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

export default function MainHeader({ opened, setOpened }: Props){
    const {classes, theme, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { data: session } = useSession()
    const { user } = session || { user: null }
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
                                        {/*<Menu.Item*/}
                                        {/*    icon={<IconHeart size="0.9rem" color={theme.colors.red[6]} stroke={1.5} />}*/}
                                        {/*>*/}
                                        {/*    Liked posts*/}
                                        {/*</Menu.Item>*/}
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
                                        <Menu.Item onClick={() => signOut()} icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}>
                                            Change account
                                        </Menu.Item>
                                        <Menu.Item onClick={() => signOut()} icon={<IconLogout size="0.9rem" stroke={1.5} />}>
                                            Logout
                                        </Menu.Item>
                                    </Menu.Dropdown>
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