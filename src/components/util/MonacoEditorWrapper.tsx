import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
    async () => {
        const { default: Monaco } = await import('react-monaco-editor');
        return Monaco;
    },
    { ssr: false }
);

interface MonacoEditorWrapperProps {
    code: string;
    onChange: (value: string, event: any) => void;
    language?: string;
    theme?: string;
    options?: {
        showLineNumbers?: boolean,
        selectOnLineNumbers?: boolean,
        fontSize?: number,
    }

}

export default function MonacoEditorWrapper({ code, onChange, language, theme, options }: MonacoEditorWrapperProps) {
    const handleEditorChange = (value: string, event: any) => {
        onChange(value, event);
    };
    // options : https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html
    return (
        <MonacoEditor
            width="100%"
            height="100%"
            language={language || "javascript"}
            theme={theme || "vs-dark"}
            value={code}
            onChange={handleEditorChange}
            options={{
                lineNumbers: options?.showLineNumbers ? "on" : "off",
                selectOnLineNumbers: true,
                fontSize: options?.fontSize || 18,
            }}
        />
    );
};