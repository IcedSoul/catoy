import {ChatMessage, MessageSource} from "../../../../common/ChatGPTCommon";
import {NextResponse} from "next/server";


const messages: Array<ChatMessage> = [
    {
        from: MessageSource.ME,
        content: '在win执行bat脚本时，每一行命令都会先被输入到命令行然后再输出结果，如何使bat像bash脚本一样只输出结果。`test`',
    },
    {
        from: MessageSource.CHAT_GPT,
        content: '在Windows中，执行批处理文件时，默认情况下每个命令都会被显示在命令行中，并且输出结果也会被显示在屏幕上。' +
            '如果想要让批处理文件的输出结果和Bash脚本一样只显示结果，可以使用以下方法：\n' +
            '1. 在批处理文件的第一行添加 @echo off，这会禁止批处理文件中的每个命令在命令行中显示。\n' +
            '2. 将所有的命令都放在一个括号内，使用 "()" 将它们括起来，然后在括号后面添加一个 @ 符号。这将禁止显示括号内的所有命令，并只显示它们的输出结果。例如：\n' +
            '```js\n' +
            'import React from \'react\'\n' +
            'import ReactDOM from \'react-dom\'\n' +
            'import ReactMarkdown from \'react-markdown\'\n' +
            'import rehypeHighlight from \'rehype-highlight\'\n' +
            '\n' +
            'ReactDOM.render(\n' +
            '  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{\'# Your markdown here\'}</ReactMarkdown>,\n' +
            '  document.querySelector(\'#content\')\n' +
            ')\n' +
            '```',
    }
]

export async function GET(request: Request) {
    return NextResponse.json(messages)
}
