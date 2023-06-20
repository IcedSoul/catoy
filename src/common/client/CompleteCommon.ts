import {TreeNode} from "@sinm/react-file-tree";

export const supportedLanguages = [
    // doc and config
    'markdown', 'yaml', 'xml', 'json',
    // regular languages
    'java', 'python', 'cpp', 'csharp', 'c', 'go', 'rust', 'ruby', 'php', 'scala', 'kotlin',
    // frontend
    'javascript', 'typescript', 'html', 'css', 'scss', 'less',
]

export const supportedThemes = [
    'global', 'vs', 'vs-dark', 'hc-black',
]

export const supportedFontSizes = [
    "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"
]

export interface FileTreeDataContent {
    id?: string,
    depth: number,
    order: number,
    type: "file" | "directory",
    classification: "doc" | "code",
    name: string,
    path: string,
    suffix?: string,
    expanded: boolean,
    children?: FileTreeDataContent[],
}

export const getTreeNode = (id: string, data: TreeNode<any, string>, parent: TreeNode | null): TreeNode<any, string> => {
    const treeNode: TreeNode<any, string> = {
        id,
        type: data.type,
        uri: data.uri,
        expanded: data.expanded,
        codeId: data?.codeId || '',
        noteId: data?.noteId || '',
        parent,
    }
    treeNode.children = data.children?.map((child) => getTreeNode(id, child, treeNode)) || []
    return treeNode
}

const cleanTreeNode = (treeNode: TreeNode<any, string>): TreeNode<any, string> => {
    return {
        id: treeNode.id,
        type: treeNode.type,
        uri: treeNode.uri,
        children: treeNode.children?.map((child) => cleanTreeNode(child)),
        expanded: treeNode.expanded,
        codeId: treeNode?.codeId || '',
        noteId: treeNode?.noteId || '',
    }
}

export const getFileTreeDataContent = (treeNode: TreeNode<any, string>): TreeNode<any, string> => {
    return cleanTreeNode(treeNode)
}

export const isRepeaterTreeNodeName = (treeNode: TreeNode<any, string>): boolean => {
    const currentName = treeNode.name
    const type = treeNode.type
    const sameNameNodes = treeNode.parent?.children?.filter(
        (child: TreeNode<any, string>) => (
            child.name === currentName || child.uri.split('/').pop() === currentName) && child.type === type
    )
    return sameNameNodes?.length > 1
}

export interface FileProps {
    uri: string,
    language: string,
    suffix: string,
    userEmail: string,
    theme?: string,
    fontSize?: string,
}

export interface CodeProps {
    codeId: string,
    uri: string,
    suffix: string,
}

export interface InsertCodeProps {
    code: string,
    position: {
        lineNumber: number,
        column: number,
    },
    lastPosition: {
        lineNumber: number,
        column: number,
    },
    endPosition: {
        lineNumber: number,
        column: number,
    }
    source?: string,
    end: boolean,
    editor?: any,
    monaco?: any,
}

export interface NoteProps {
    uri: string,
    noteId: string,
}

export const getLanguageFromSuffix = (suffix: string): string => {
    const suffixToLanguage: any = {
        "md": "markdown",
        "yaml": "yaml",
        "yml": "yaml",
        "xml": "xml",
        "json": "json",
        "java": "java",
        "py": "python",
        "cpp": "cpp",
        "cs": "csharp",
        "js": "javascript",
        "ts": "typescript",
        "html": "html",
        "css": "css",
        "scss": "scss",
        "less": "less",
        "go": "go",
        "rs": "rust",
        "rb": "ruby",
        "php": "php",
        "scala": "scala",
        "kt": "kotlin",
    }
    return suffixToLanguage[suffix] || "markdown"
}

export const getSuffixFromLanguage = (language: string): string => {
    const languageToSuffix: any = {
        "markdown": "md",
        "yaml": "yaml",
        "xml": "xml",
        "json": "json",
        "java": "java",
        "python": "py",
        "cpp": "cpp",
        "csharp": "cs",
        "javascript": "js",
        "typescript": "ts",
        "html": "html",
        "css": "css",
        "scss": "scss",
        "less": "less",
        "go": "go",
        "rust": "rs",
        "ruby": "rb",
        "php": "php",
        "scala": "scala",
        "kotlin": "kt",
    }
    return languageToSuffix[language] || "md"
}

export const changeSuffix = (uri: string, suffix: string): string => {
    const uriSplit = uri.split('.')
    if(uriSplit.length > 1){
        uriSplit.pop()
    }
    uriSplit.push(suffix)
    return uriSplit.join('.')
}

export const calculateNewPosition = (code: string, position: {lineNumber: number, column: number}): {lineNumber: number, column: number} => {
    if(code.length === 0){
        return position
    }
    const lines = code.split('\n')
    if(lines.length === 1){
        return {
            lineNumber: position.lineNumber,
            column: position.column + code.length,
        }
    }
    return {
        lineNumber: position.lineNumber + lines.length - (lines[lines.length - 1].length === 0 ? 0 : 1),
        column: lines[lines.length - 1].length + 1,
    }
}

export const CODE_ID = "completion-code-id"