import {useEffect, useState} from "react";
import {Button, Container, createStyles, Group, Input, NativeSelect, Select, Switch, Text} from "@mantine/core";
import MonacoEditorWrapper from "@/components/util/MonacoEditorWrapper";
import {supportedLanguages, supportedThemes} from "@/common/client/CompleteCommon";

const useStyles = createStyles((theme) => ({
    toolBar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        height: '3rem',
        padding: '0.3rem',
        marginBottom: '0.3rem',
    }
}))

export const Completion = () => {
    const { classes } = useStyles()
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('javascript');
    const [theme, setTheme] = useState<string>('vs-dark');

    useEffect(() => {
        setCode("console.log('Hello World!');")
        console.log(code);
    }, []);

    const onCodeChange = (value: string, event: any) => {
        setCode(value);
    }

    return (
        <Container h="100%" fluid>
            <Group className={classes.toolBar}>
                <Text>Languages: </Text>
                <Select data={supportedLanguages} defaultValue={supportedLanguages[0]} placeholder="Select language" onChange={(value) => setLanguage(value || "javascript")}/>
                <Text>Theme: </Text>
                <Select data={supportedThemes} defaultValue={supportedThemes[0]} placeholder="Select language" onChange={(value) => setTheme(value || "vs-dark")}/>
                <Text>Font size: </Text>
                <Input placeholder="16"></Input>
                <Switch
                    labelPosition="left"
                    label="Line numbers: "
                />
                <Button variant="outline">
                    Complete
                </Button>

            </Group>
            <MonacoEditorWrapper code={code} onChange={onCodeChange} theme={theme} language={language}/>
        </Container>
    )
}