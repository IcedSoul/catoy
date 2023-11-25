import {
    Code,
    createStyles,
    Navbar,
    rem,
    TextInput,
    UnstyledButton
} from "@mantine/core";
import {IconApps, IconBrandHipchat, IconBrandVscode, IconNote, IconSearch} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import Router from 'next/router'
import {NavbarSession} from "@/components/chat/NavbarSession";
import {NavbarCode} from "@/components/completion/NavbarCode";
import {NavbarNote} from "@/components/doc/NavbarNote";

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
}));

const links = [
    { icon: IconBrandHipchat, label: 'ChatGPT', route: '/chat' },
    { icon: IconBrandVscode, label: 'Completion', route: '/completion' },
    { icon: IconNote, label: 'Note', route: '/note' },
    { icon: IconApps, label: 'Applications', route: '/apps' },
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

export enum NavBarType {
    NONE,
    CHAT,
    COMPLETION,
    NOTE,
    APPS
}

type NvaBarProps = {
    opened: boolean
    setOpened: (opened: boolean) => void
}

export const MainNavBar = ({ opened, setOpened }: NvaBarProps) => {
    const { classes: styles } = useStyles();
    const [navBarType, setNavBarType] = useState<NavBarType>(NavBarType.NONE)

    useEffect(() => {
        const route = Router.route
        if(route === '/chat' || route === '/'){
            setNavBarType(NavBarType.CHAT)
        } else if(route === '/completion'){
            setNavBarType(NavBarType.COMPLETION)
        } else if(route === '/note'){
            setNavBarType(NavBarType.NOTE)
        } else if(route === '/apps'){
            setNavBarType(NavBarType.APPS)
        }
    }, [])

    const onChangeRoute = (route: string) => {
        Router.push(route).then()
    }

    const mainLinks = links.map((link) => (
        <UnstyledButton key={link.label} className={styles.mainLink} onClick={() => onChangeRoute(link.route)}>
            <div className={styles.mainLinkInner}>
                <link.icon size={20} className={styles.mainLinkIcon} stroke={1.5} />
                <span>{link.label}</span>
            </div>
        </UnstyledButton>
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
            {
                navBarType === NavBarType.CHAT ? (<NavbarSession opened={opened} setOpened={setOpened}/>) :
                    navBarType === NavBarType.COMPLETION ? (<NavbarCode opened={opened} setOpened={setOpened}/>):
                        navBarType === NavBarType.NOTE ? (<NavbarNote opened={opened} setOpened={setOpened}/>) : null
            }
        </Navbar>
    );
}