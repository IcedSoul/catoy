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
import {IconBrandHipchat, IconCheckbox, IconPlus, IconSearch, IconUser} from "@tabler/icons-react";
import {useState} from "react";

const useStyles = createStyles((theme) => ({
    navbar: {
        paddingTop: 0,
    },

    header: {
        padding: theme.spacing.md,
        paddingTop: 0,
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderBottom: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
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

    collectionLink: {
        display: 'block',
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
        },
    },
}));

const links = [
    { icon: IconBrandHipchat, label: 'ChatGPT' },
    { icon: IconCheckbox, label: 'Tasks' },
    { icon: IconUser, label: 'Contacts' },
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

export default function MainNavBar() {
    const { classes: styles } = useStyles();

    const [opened, setOpened] = useState(false);

    const mainLinks = links.map((link) => (
        <UnstyledButton key={link.label} className={styles.mainLink}>
            <div className={styles.mainLinkInner}>
                <link.icon size={20} className={styles.mainLinkIcon} stroke={1.5} />
                <span>{link.label}</span>
            </div>
        </UnstyledButton>
    ));

    const collectionLinks = toys.map((toy) => (
        <a
            href="/"
            onClick={(event) => event.preventDefault()}
            key={toy.label}
            className={styles.collectionLink}
        >
            <span style={{ marginRight: rem(9), fontSize: rem(16) }}>{toy.emoji}</span>{' '}
            {toy.label}
        </a>
    ));

    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <Navbar.Section className={styles.header}>
                <Group position="apart">
                    <Image src="/logo.png" width={rem(120)} />
                    <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
                </Group>
            </Navbar.Section>

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
                        Collections
                    </Text>
                    <Tooltip label="Create collection" withArrow position="right">
                        <ActionIcon variant="default" size={18}>
                            <IconPlus size="0.8rem" stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
                <div className={styles.collections}>{collectionLinks}</div>
            </Navbar.Section>
        </Navbar>
    );

}