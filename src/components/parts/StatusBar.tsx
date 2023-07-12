import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, rem } from '@mantine/core';
import {IconChartPie} from '@tabler/icons-react';

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        overflow: 'visible',
        padding: theme.spacing.xl,
        paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
    },

    icon: {
        position: 'absolute',
        top: `calc(-${ICON_SIZE} / 3)`,
        left: `calc(50% - ${ICON_SIZE} / 2)`,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.dark[5],
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

type StatusBarProps = {
    title?: string;
    limit?: number;
    usage?: number;
    type?: "daily" | "total";
}

export default function StatusBar( props: StatusBarProps) {
    const { classes } = useStyles();

    return (
        <Paper radius="md" withBorder className={classes.card} mt={`calc(${ICON_SIZE} / 3)`}>
            <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
                <IconChartPie size="2rem" stroke={1.5} />
            </ThemeIcon>

            <Text ta="center" fw={700} className={classes.title}>
                {props.title || ""} Conversations Usage
            </Text>
            <Text c="dimmed" ta="center" fz="sm">
                { props?.limit } Conversations {props.type === "daily" ? "/ Day" : " Total"}
            </Text>

            <Group position="apart" mt="xs">
                <Text fz="sm" color="dimmed">
                    Usage
                </Text>
                <Text fz="sm" color="dimmed">
                    { Math.round(((props?.usage || 0) / (props?.limit || 1) * 10000)) / 100.0 }%
                </Text>
            </Group>

            <Progress value={Math.round(((props?.usage || 0) / (props?.limit || 1)) * 10000) / 100.0} mt={5} />

            <Group position="apart" mt="md">
                <Text fz="sm"> {props?.usage} / {props?.limit} conversations</Text>
                <Badge size="sm">{((props?.limit || 0) - (props?.usage || 0))} conversations left</Badge>
            </Group>
        </Paper>
    )
}