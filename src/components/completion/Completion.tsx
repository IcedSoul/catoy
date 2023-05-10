import {useEffect, useState} from "react";
import {
    Button,
    Container,
    createStyles,
    Divider, Flex, Grid,
    Group,
    Select,
    Switch,
    Text, useMantineColorScheme
} from "@mantine/core";
import MonacoEditorWrapper from "@/components/util/MonacoEditorWrapper";
import {supportedFontSizes, supportedLanguages, supportedThemes} from "@/common/client/CompleteCommon";

const useStyles = createStyles((theme) => ({
    toolBar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        height: '3rem',
        marginTop: '0.3rem',
        marginBottom: '0.3rem',
        borderRadius: '0.5rem',
        border: '1px solid',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    },

    tools: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0.3rem 0',
        padding: '0 1.5rem',
        gap: '0.5rem',
    },

    completeButton: {
        margin: '0.3rem 0',
        paddingRight: '1.0rem',
    },

    editor: {
        display: 'flex',
        flexGrow: 1,
        height: '100%',
    }
}))

export const Completion = () => {
    const { classes } = useStyles()
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('javascript');
    const [fontSize, setFontSize] = useState<number>(18)
    const [lineNumbers, setLineNumbers] = useState<boolean>(true)
    const { colorScheme } = useMantineColorScheme()
    const [theme, setTheme] = useState<string>(supportedThemes[0]);

    useEffect(() => {}, []);

    const onCodeChange = (value: string, event: any) => {
        setCode(value);
    }

    const getTheme = () => {
        if (theme !== supportedThemes[0]){
            return theme;
        }
        return colorScheme === 'dark' ? 'vs-dark' : 'vs';
    }

    return (
        <Container h="100%" fluid>
            <Flex w="100%" h="100%" direction="column">
            <Group position="apart" className={classes.toolBar}>
                <Grid className={classes.tools}>
                    <Text>Languages: </Text>
                    <Select
                        data={supportedLanguages}
                        defaultValue={supportedLanguages[0]}
                        placeholder="Select language"
                        onChange={(value) => setLanguage(value || supportedLanguages[0])}
                        w="8rem"
                        searchable/>
                    <Divider size="sm" orientation="vertical"/>
                    <Text>Theme: </Text>
                    <Select
                        data={supportedThemes}
                        defaultValue={supportedThemes[0]}
                        placeholder="Select theme"
                        onChange={(value) => setTheme(value || supportedThemes[0])}
                        w="6rem"
                        searchable/>
                    <Divider size="sm" orientation="vertical" />
                    <Text>Font size: </Text>
                    <Select
                        data={supportedFontSizes}
                        defaultValue={supportedFontSizes[2]}
                        placeholder="Font size"
                        onChange={(value) => setFontSize(parseInt(value || supportedFontSizes[2]))}
                        w="5rem"
                        searchable/>
                    <Divider size="sm" orientation="vertical" />
                    <Switch
                        labelPosition="left"
                        label="Line numbers: "
                        checked={lineNumbers}
                        onChange={() => setLineNumbers(!lineNumbers)}
                    />
                </Grid>
                <Grid className={classes.completeButton}>
                    <Button variant="outline">
                        Complete
                    </Button>
                </Grid>
            </Group>
            <Flex w="100%" className={classes.editor}>
                <MonacoEditorWrapper code={code} onChange={onCodeChange} theme={getTheme()} language={language} options={{fontSize, showLineNumbers: lineNumbers}}/>
            </Flex>
            </Flex>
        </Container>
    )
}