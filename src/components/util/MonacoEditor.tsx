import {Editor, Monaco} from "@monaco-editor/react";
import {ForwardedRef, forwardRef, useRef} from "react";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import {useGlobalContext} from "@/components/providers/GlobalContextProvider";
import {InsertCodeProps} from "@/common/client/CompleteCommon";

export interface MonacoEditorProps {
    code: string;
    onChange: (value: string, event: any) => void;
    onDidMount?: (editor: IStandaloneCodeEditor, monaco: Monaco) => void;
    language?: string;
    theme?: string;
    options?: {
        showLineNumbers?: boolean,
        selectOnLineNumbers?: boolean,
        fontSize?: number,
    };
    onPositionChange?: (event: any) => void;
    ref?: ForwardedRef<any>
}

export const MonacoEditor = ({ code, onChange, language, theme, options, onPositionChange, onDidMount }: MonacoEditorProps) => {
    const editorRef = useRef<IStandaloneCodeEditor>();
    const { setRefreshInsertCode } = useGlobalContext()
    const handleEditorChange = (value: string | undefined, event: any) => {
        onChange(value || "", event);
    };

    const handleEditorDidMount = (editor: IStandaloneCodeEditor, monaco: Monaco) => {
        onDidMount && onDidMount(editor, monaco);
        editorRef.current = editor;
        onPositionChange && editor.onDidChangeCursorPosition(onPositionChange)
        setRefreshInsertCode && setRefreshInsertCode(() => insertCode)
        editor.addAction({
            id: 'insert-code',
            label: 'Insert Code',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Tab,
            ],
            contextMenuGroupId: 'navigation',
            run: () => {
                console.log('insert code')
            }
        })
    }

    const insertCode = (code: InsertCodeProps) => {
        const editor = code.editor || editorRef.current;
        const currentPos = code.lastPosition || editor?.getPosition();
        editor.setPosition(currentPos)
        editor.focus();
        const selection = editor?.getSelection();
        const id = { major: 1, minor: 1 };
        const op = {
            identifier: id,
            range: {
                startLineNumber: code.position.lineNumber || selection?.selectionStartLineNumber || 1,
                startColumn: code.position.column || selection?.selectionStartColumn || 1,
                endLineNumber: code.lastPosition.lineNumber || selection?.endLineNumber || 1,
                endColumn: code.lastPosition.column || selection?.endColumn || 1,
            },
            text: code.code,
            forceMoveMarkers: true,
        };
        editor.executeEdits(code.source, [op]);
        editor.setPosition(code.endPosition)
        editor.focus();
    }


    return (
        <Editor
            width="100%"
            height="100%"
            language={language || "javascript"}
            theme={theme || "vs-dark"}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
                lineNumbers: options?.showLineNumbers ? "on" : "off",
                selectOnLineNumbers: true,
                fontSize: options?.fontSize || 18,
            }}/>
    )
}