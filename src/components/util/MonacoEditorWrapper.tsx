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
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({ code, onChange, language, theme }) => {
    const handleEditorChange = (value: string, event: any) => {
        onChange(value, event);
    };

    return (
        <MonacoEditor
            width="100%"
            height="100%"
            language={language || "javascript"}
            theme={theme || "vs-dark"}
            value={code}
            onChange={handleEditorChange}
            options={{
                selectOnLineNumbers: true,
            }}
        />
    );
};

export default MonacoEditorWrapper;
