import React, { useEffect, useRef, useState} from "react";
import {
    Button, Center,
    Container,
    createStyles,
    Divider, Flex, Grid,
    Group,
    Select,
    Switch,
    Text, useMantineColorScheme
} from "@mantine/core";
import {
    calculateNewPosition,
    changeSuffix,
    CODE_ID, CodeProps,
    getLanguageFromSuffix, getSuffixFromLanguage,
    supportedFontSizes,
    supportedLanguages,
    supportedThemes
} from "@/common/client/CompleteCommon";
import {useGlobalContext} from "@/components/providers/GlobalContextProvider";
import {CodeSegment} from "@/common/server/repository/Models";
import {notifications} from "@mantine/notifications";
import {addCookie, getCookieByName, removeCookie} from "@/common/client/common";
import dynamic from 'next/dynamic';
import {decoder, HttpMethod} from "@/common/client/ChatGPTCommon";
import {useSession} from "next-auth/react";

const MonacoEditor = dynamic(
    () => import("@/components/util/MonacoEditor").then(module => module.MonacoEditor),
    { ssr: false }
);

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
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('javascript');
    const [fontSize, setFontSize] = useState<number>(18)
    const [lineNumbers, setLineNumbers] = useState<boolean>(true)
    const { colorScheme } = useMantineColorScheme()
    const [theme, setTheme] = useState<string>(supportedThemes[0]);
    const [currentCode, setCurrentCode] = useState<CodeSegment | null>(null);
    const [currentCodeProps, setCurrentCodeProps] = useState<CodeProps | null>(null);
    const [cursorPosition, setCursorPosition] = useState<{lineNumber: number, column: number}>({lineNumber: 1, column: 1})
    // const [silence, setSilence] = useState<boolean>(false)
    const {setRefreshCode, refreshFile, refreshInsertCode} = useGlobalContext()
    const { data: session } = useSession()
    const { user } = session || { user: null }

    useEffect(() => {
        setRefreshCode(() => loadCode)
        removeCookie(CODE_ID)
    }, []);

    const onLanguageChange = (language: string) => {
        if(!currentCodeProps || !currentCode) {
            return
        }
        if(getLanguageFromSuffix(currentCodeProps?.suffix) !== language) {
            const suffix = getSuffixFromLanguage(language)
            currentCode.language = language
            currentCode.suffix = suffix
            currentCode.title = changeSuffix(currentCode.title, suffix)
            currentCode.code = code
            updateCode(currentCode)
            refreshFile({
                uri: currentCodeProps.uri,
                suffix: suffix,
                language: language,
                userEmail: user?.email || ''
            })
        }
        setLanguage(language)
    }

    const loadCode = (codeProps: CodeProps) => {
        if(!codeProps || !codeProps.codeId) {
            setCurrentCodeProps(null)
            setCurrentCode(null)
            return;
        }
        setCurrentCodeProps(codeProps)
        const { codeId } = codeProps
        if(getCookieByName(CODE_ID) === codeId) {
            return;
        }
        fetch("/api/completion/code?".concat(new URLSearchParams({ codeId }).toString()))
            .then<Array<CodeSegment>>(response => response.json())
            .then((codes: Array<CodeSegment>) => {
                if(codes.length > 0) {
                    refreshCode(codes[0])
                } else {
                    removeCookie(CODE_ID)
                    setCurrentCodeProps(null)
                    setCurrentCode(null)
                    notifications.show({message: 'File not found', color: 'red'})
                }
            })
    }

    const refreshCode = (code: CodeSegment) => {
        setCurrentCode(code)
        addCookie(CODE_ID, code.codeId)
        setLanguage(getLanguageFromSuffix(code.language))
        setCode(code.code)
    }

    const updateCode = (code: CodeSegment) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const requestInit: RequestInit = {
            method: HttpMethod.PUT,
            headers,
            body: JSON.stringify(code)
        }
        fetch('/api/completion/code', requestInit).then((response) => response.json()).then(() => {
            // update success
            // setSilence(false)
        }).catch((error) => {
            notifications.show({message: JSON.stringify(error), color: 'red'})
        })
    }

    const onCodeChange = (value: string, event: any) => {
        setCode(value);
        if(currentCode && currentCode.code !== value) {
            currentCode.code = value;
            updateCode(currentCode)
        }
    }

    const getTheme = () => {
        if (theme !== supportedThemes[0]){
            return theme;
        }
        return colorScheme === 'dark' ? 'vs-dark' : 'vs';
    }

    const onPositionChange = (event: any) => {
        setCursorPosition(event.position)
    }

    const completeCode = async () => {
        if(!currentCode) {
            return
        }
        const headers = {
            'Content-Type': 'application/json'
        }
        const requestInit: RequestInit = {
            method: HttpMethod.POST,
            headers,
            body: JSON.stringify({
                code: currentCode.code,
                language: currentCode.language,
                position: cursorPosition
            })
        }
        const response = await fetch('/api/completion/code/complete', requestInit).then(response => response.body).catch(() => {
            notifications.show({message: 'Failed to complete code', color: 'red'})
        })
        if(!response) return
        let responseStr = ""
        let lastPosition = cursorPosition, endPosition = cursorPosition
        const reader = response.getReader()
        while (true){
            const {done, value } = await reader.read()
            if(done){
                refreshInsertCode && refreshInsertCode({
                    code: responseStr,
                    position: cursorPosition,
                    lastPosition,
                    endPosition,
                    editor: editorRef.current,
                    monaco: monacoRef.current,
                    source: 'completion',
                    end: true
                })
                break
            }
            const codeIncrement: string = decoder.decode(value)
            responseStr = responseStr.concat(codeIncrement)
            endPosition = calculateNewPosition(responseStr, cursorPosition)
            refreshInsertCode && refreshInsertCode({
                code: responseStr,
                position: cursorPosition,
                lastPosition,
                endPosition,
                editor: editorRef.current,
                monaco: monacoRef.current,
                source: 'completion',
                end: false
            })
            lastPosition = endPosition
        }
    }

    const onDidEditorMount = (editor: any, monaco: any) => {
        editorRef.current = editor
        monacoRef.current = monaco
    }

    return (
        <Container h="100%" fluid>
            {currentCode === null ? (
                <Center h="100%" mx="auto">
                    No file selected
                </Center>) : (
                <>
                    <Flex w="100%" h="100%" direction="column">
                        <Group position="apart" className={classes.toolBar}>
                            <Grid className={classes.tools}>
                                <Text>Languages: </Text>
                                <Select
                                    data={supportedLanguages}
                                    defaultValue={supportedLanguages[0]}
                                    value={language}
                                    placeholder="Select language"
                                    onChange={(value) => onLanguageChange(value || supportedLanguages[0])}
                                    w="8rem"
                                    searchable/>
                                <Divider size="sm" orientation="vertical"/>
                                <Text>Theme: </Text>
                                <Select
                                    data={supportedThemes}
                                    defaultValue={supportedThemes[0]}
                                    value={theme}
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
                                <Button variant="outline" onClick={() => completeCode().then()}>
                                    Complete
                                </Button>
                            </Grid>
                        </Group>
                        <Flex w="100%" className={classes.editor}>
                            <MonacoEditor
                                code={code}
                                onChange={onCodeChange}
                                onDidMount={onDidEditorMount}
                                theme={getTheme()}
                                language={language}
                                options={{fontSize, showLineNumbers: lineNumbers}}
                                onPositionChange={onPositionChange}
                                />
                        </Flex>
                    </Flex>
                </>
            )}

        </Container>
    )
}