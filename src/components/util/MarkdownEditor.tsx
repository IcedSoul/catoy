import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import rust from 'highlight.js/lib/languages/rust';
import dart from 'highlight.js/lib/languages/dart';
import scala from 'highlight.js/lib/languages/scala';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import yaml from 'highlight.js/lib/languages/yaml';
import {createStyles} from "@mantine/core";
import {IconColorPicker} from "@tabler/icons-react";
import {TextStyle} from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";

lowlight.registerLanguage('typescript', ts);
lowlight.registerLanguage('ts', ts);
lowlight.registerLanguage('javascript', js);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('json', json);
lowlight.registerLanguage('bash', bash);
lowlight.registerLanguage('shell', shell);
lowlight.registerLanguage('sql', sql);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('java', java);
lowlight.registerLanguage('csharp', csharp);
lowlight.registerLanguage('php', php);
lowlight.registerLanguage('ruby', ruby);
lowlight.registerLanguage('go', go);
lowlight.registerLanguage('kotlin', kotlin);
lowlight.registerLanguage('swift', swift);
lowlight.registerLanguage('rust', rust);
lowlight.registerLanguage('dart', dart);
lowlight.registerLanguage('scala', scala);
lowlight.registerLanguage('c', c);
lowlight.registerLanguage('cc', c);
lowlight.registerLanguage('cpp', cpp);
lowlight.registerLanguage('yaml', yaml);

const useStyles = createStyles((theme) => ({
    markdownEditor: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : "#fff",
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
        '&:focus-within': {
            borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[5],
        },
        overflowX: 'hidden',
        overflowY: 'auto',
    },
    content: {
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    }
}))

interface MarkdownEditorProps {
    content: string;
    onChange?: (content: string) => void;
}

export const MarkdownEditor = ({content, onChange}: MarkdownEditorProps) => {
    const { classes } = useStyles()
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextStyle,
            Color,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content,
        onUpdate({ editor }) {
            onChange && onChange(editor.getHTML());
        }
    });

    const focus = (event: MouseEvent) => {
        if(event.target !== event.currentTarget) return;
        editor?.chain().focus('end').run();
    }

    return (
        <RichTextEditor className={classes.markdownEditor} editor={editor} onClick={(event: any) => focus(event)} h="100%">
            <RichTextEditor.Toolbar sticky>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.CodeBlock />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.ColorPicker
                        colors={[
                            '#25262b',
                            '#868e96',
                            '#fa5252',
                            '#e64980',
                            '#be4bdb',
                            '#7950f2',
                            '#4c6ef5',
                            '#228be6',
                            '#15aabf',
                            '#12b886',
                            '#40c057',
                            '#82c91e',
                            '#fab005',
                            '#fd7e14',
                        ]}
                    />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control interactive={false}>
                        <IconColorPicker size="1rem" stroke={1.5} />
                    </RichTextEditor.Control>
                    <RichTextEditor.Color color="#F03E3E" />
                    <RichTextEditor.Color color="#7048E8" />
                    <RichTextEditor.Color color="#1098AD" />
                    <RichTextEditor.Color color="#37B24D" />
                    <RichTextEditor.Color color="#F59F00" />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content className={classes.content} h="100%"/>
        </RichTextEditor>
    );
}
