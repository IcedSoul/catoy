import React, {useEffect, useRef, useState} from "react";
import {FileTree, TreeNode} from "@sinm/react-file-tree";
import '@sinm/react-file-tree/icons.css';
import '@/components/completion/FileTree.css';
import {
    changeSuffix,
    FileProps,
    getFileTreeDataContent,
    getTreeNode,
    isRepeaterTreeNodeName
} from "@/common/client/CompleteCommon";
import {notifications} from "@mantine/notifications";
import {createStyles, Group, Input, Menu, Navbar, rem, Text} from "@mantine/core";
import {HttpMethod} from "@/common/client/ChatGPTCommon";
import {db, getClassWithColor} from "@sinm/react-file-tree/lib/file-icons/file-icons";
import {IconCheck, IconDots, IconEdit, IconFileCode, IconFolder, IconTrash, IconX} from "@tabler/icons-react";
import {useSession} from "next-auth/react";
import {CodeSegment, FileTreeData} from "@/common/server/repository/Models";
import {useGlobalContext} from "@/components/providers/GlobalContextProvider";

const useStyles = createStyles((theme) => ({
    section: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
    },

    collectionsHeader: {
        paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
        paddingRight: theme.spacing.md,
        marginBottom: rem(5),
    },

    collection: {
        width: '100%',
        padding: `${rem(8)} ${theme.spacing.xs}`,
        textDecoration: 'none',
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        lineHeight: 1,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            cursor: 'pointer',
        },
    },

    collections: {
        paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingBottom: theme.spacing.md,
        height: '100%',
    },
    treeBox: {
        display: "flex",
        width: "100%",
        height: "fit-content"
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        flexGrow: 0,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
            color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[8],
        }
    },

    edit: {
        display: "flex",
        gap: rem(8)
    },
}))

const root: TreeNode<any, string> = {
    type: "directory",
    uri: "projects",
    expanded: true,
    children: [],
    root: true,
}

const getFileName = (uri: string): string => {
    return decodeURIComponent(uri.split("/").pop() || '')
}

interface NavbarCodeProps {
    opened: boolean
    setOpened: (opened: boolean) => void
}

export function NavbarCode({opened, setOpened}: NavbarCodeProps){
    const { classes } = useStyles()
    const [ tree, setTree ] = useState<TreeNode<any, string>>(root)
    const { refreshCode, setRefreshFile } = useGlobalContext()
    const fileTreeRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { data: session } = useSession()
    const { user } = session || { user: null }

    useEffect(() => {
        loadFileTree()
        setRefreshFile(() => refreshFile)
    },[])

    const refreshFile = (fileProps: FileProps) => {
        const treeNode = findTreeNode(tree, fileProps.uri)
        if(treeNode) {
            treeNode.uri = changeSuffix(treeNode.uri, fileProps.suffix)
            treeNode.name = changeSuffix(treeNode.name, fileProps.suffix)
            treeNode.userEmail = fileProps.userEmail
            createOrUpdateFileTree(treeNode)
            refreshCode({
                codeId: treeNode.codeId,
                uri: treeNode.uri,
                suffix: fileProps.suffix
            })
        }
    }

    const findTreeNode = (treeNode: TreeNode<any, string>, uri: string): TreeNode<any, string> | undefined => {
        if(treeNode.uri === uri){
            return treeNode
        }
        if(treeNode.children){
            for(let i = 0; i < treeNode.children.length; i++){
                const child = treeNode.children[i]
                const result = findTreeNode(child, uri)
                if(result){
                    return result
                }
            }
        }
        return undefined
    }

    const createNewDirectoryOrFile = (type: "directory" | "file", treeNode: TreeNode<any, string>, event: any) => {
        event.stopPropagation()
        if(!treeNode.children){
            treeNode.children = []
        }
        treeNode.children.push({
            id: treeNode.id,
            type,
            uri: `${treeNode.uri}/${type === "directory" ? "NewFolder" : "NewFile.ts"}`,
            expanded: false,
            children: [],
            edit: true,
            parent: treeNode
        })
        treeNode.expanded = true
        setTree({...tree})
    }
    const deleteDirectoryOrFile = (treeNode: TreeNode<any, string>, event: any) => {
        event.stopPropagation()
        deleteTreeNode(treeNode)
    }

    const renameDirectoryOrFile = (treeNode: TreeNode<any, string>, event: any) => {
        event.stopPropagation()
        treeNode.edit = true
        setTree({...tree})
    }

    const menu = (treeNode: TreeNode<any, string>) => (
        <Menu shadow="md" width={150}>
            <Menu.Target>
                <IconDots size={16} stroke={1.5} className={classes.icon} onClick={(event) => {event.stopPropagation()}}/>
            </Menu.Target>
            <Menu.Dropdown>
                {
                    treeNode.type === "directory" && (
                        <>
                            <Menu.Item
                                icon={<IconFolder size={12}/>}
                                onClick={(event) => createNewDirectoryOrFile("directory", treeNode, event)}>
                                New Folder
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconFileCode size={12}/>}
                                onClick={(event) => createNewDirectoryOrFile("file", treeNode, event)}
                            >
                                New File
                            </Menu.Item>
                        </>
                    )
                }
                {
                    !("root" in treeNode && treeNode.root) && (
                        <>
                            <Menu.Item
                                icon={<IconEdit size={12}/>}
                                onClick={(event) => renameDirectoryOrFile(treeNode, event)}
                            >
                                Rename
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconTrash size={12}/>}
                                onClick={(event) => deleteDirectoryOrFile(treeNode, event)}
                            >
                                Delete
                            </Menu.Item>
                        </>
                    )
                }
            </Menu.Dropdown>
        </Menu>
    )

    const confirmCreate = (treeNode: TreeNode<any, string>) => {
        if(treeNode.name.length === 0){
            notifications.show({
                message: "Name cannot be empty",
            })
            setTree({...tree})
            inputRef.current?.focus()
            return
        }
        if(isRepeaterTreeNodeName(treeNode)){
            notifications.show({
                message: "Name already exists, please change it",
            })
            setTree({...tree})
            inputRef.current?.focus()
            return
        }
        treeNode.edit = false
        treeNode.uri = `${treeNode.uri.substring(0, treeNode.uri.lastIndexOf("/"))}/${treeNode.name}`
        if(treeNode.type === "file"){
            createCode(treeNode).then(() => {
                createOrUpdateFileTree(treeNode)
            })
        } else {
            createOrUpdateFileTree(treeNode)
        }
    }

    const cancelCreate = (treeNode: TreeNode<any, string>) => {
        if(treeNode.parent){
            treeNode.parent.children.splice(treeNode.parent.children.indexOf(treeNode), 1)
        } else {
            root?.children?.splice(root?.children.indexOf(treeNode), 1)
        }
        setTree({...tree})
    }

    const edit = (treeNode: TreeNode) => (
        <div className={classes.edit}>
            <IconCheck size={16} stroke={1.5} className={classes.icon}/>
            <IconX size={16} stroke={1.5} className={classes.icon} onClick={() => cancelCreate(treeNode)}/>
        </div>
    )

    const getIconClass = (fileName: string, isDirectory: boolean, expanded: boolean): string | undefined => {
        if (isDirectory) {
            return `${expanded ? "folder-icon-open" : "folder-icon"}  light-folder-color`;
        }
        else {
            const icon = db.matchName(fileName, false);
            const className: string = getClassWithColor(fileName, icon) as string;
            return className || "file-icon light-blue";
        }
    }

    const onEditTreeNodeName = (treeNode: TreeNode<any, string>, event: any) => {
        treeNode.name = event.target.value
        setTree({...tree})
    }

    const onEditKeyDown = (treeNode: TreeNode<any, string>, event: any) => {
        if(event.key === "Enter"){
            confirmCreate(treeNode)
        } else if(event.key === "Escape"){
            cancelCreate(treeNode)
        }
    }

    const itemRenderer = (treeNode: TreeNode<any, string>) => {
        const name: string = getFileName(treeNode.uri);
        if(!("name" in treeNode)) {
            treeNode.name = name
        }
        const isDirectory: boolean = treeNode.type === "directory";
        const expanded: boolean = treeNode.expanded as boolean;
        const editing: boolean = treeNode?.edit || false

        return (
            <Group position="apart" className={classes.collection}>
                <div className="file-tree__tree-item">
                    <span className="file-tree__icon">
                        <span className={getIconClass(name, isDirectory, expanded)} />
                    </span>
                    <span className="file-tree__name">
                        {
                            editing? (<Input
                                variant="unstyled"
                                size="xs"
                                value={treeNode.name}
                                onChange={(event) => onEditTreeNodeName(treeNode, event)}
                                onKeyDown={(event) => onEditKeyDown(treeNode, event)}
                                onBlur={() => confirmCreate(treeNode)}
                                ref={inputRef}
                                w={"80px"}
                                autoFocus/>) : name
                        }
                    </span>
                </div>
                { editing ? edit(treeNode) : menu(treeNode) }
            </Group>
        );
    }

    const loadFileTree = () => {
        fetch("/api/completion/fileTree")
            .then((response) => response.json())
            .then(fileTrees => {
                if(fileTrees){
                    root.children = fileTrees.map((fileTree: FileTreeData) => getTreeNode(fileTree.id, JSON.parse(fileTree.content), root))
                    setTree({...root})
                } else {
                    root.children = []
                    setTree({...root})
                }
            }).catch((error) => {
                notifications.show(error)
            })
    }

    const createOrUpdateFileTree
        = (treeNode: TreeNode<any, string>) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        while (treeNode.parent && !("root" in treeNode.parent)) {
            treeNode = treeNode.parent
        }
        const body = {
            id: treeNode?.id || undefined,
            name: treeNode.name,
            userEmail: user?.email || treeNode.userEmail,
            classification: "code",
            content: JSON.stringify(getFileTreeDataContent(treeNode)),
        }
        const requestInit: RequestInit = {
            method: HttpMethod.POST,
            headers,
            body: JSON.stringify(body)
        }
        fetch("/api/completion/fileTree", requestInit).then(() => {
            loadFileTree()
        }).catch((error) => {
            notifications.show(error)
        })
    }

    const deleteTreeNode = (treeNode: TreeNode<any, string>) => {
        if(treeNode.parent && "root" in treeNode.parent){
            deleteFileTree(treeNode.id)
        } else {
            if(treeNode.type === "file"){
                deleteCode(treeNode).then()
                if(refreshCode){
                    refreshCode({codeId: "", uri: "", suffix: ""})
                }
            }
            treeNode.parent?.children?.splice(treeNode.parent?.children?.indexOf(treeNode), 1)
            createOrUpdateFileTree(treeNode.parent)
        }
    }

    const deleteFileTree = (id: string) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const requestInit: RequestInit = {
            method: HttpMethod.DELETE,
            headers,
            body: JSON.stringify({id})
        }
        fetch("/api/completion/fileTree", requestInit).then(() => {
            loadFileTree()
        }).catch((error) => {
            notifications.show(error)
        })
    }

    const createCode = async (treeNode: TreeNode<any, string>) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const name = treeNode.name
        const suffix = treeNode.name.split(".").pop()
        const body = {
            title: name,
            suffix: suffix,
            language: suffix,
            code: '',
            version: '0.0.1',
            gitUrl: '',
        }
        const requestInit: RequestInit = {
            method: HttpMethod.POST,
            headers,
            body: JSON.stringify(body)
        }
        const codeSegment: CodeSegment = await fetch('/api/completion/code', requestInit).then((response) => response.json()).catch((error) => {
            notifications.show(error)
        })
        if(codeSegment){
            treeNode.codeId = codeSegment.codeId
            if(refreshCode){
                refreshCode({
                    codeId: codeSegment.codeId,
                    uri: treeNode.uri,
                    suffix: codeSegment.suffix
                })
            }
        }
    }

    const deleteCode = async (treeNode: TreeNode<any, string>) => {
        if(!treeNode.codeId){
            return
        }
        const headers = {
            'Content-Type': 'application/json'
        }
        const requestInit: RequestInit = {
            method: HttpMethod.DELETE,
            headers,
            body: JSON.stringify({ codeId: treeNode.codeId })
        }
        fetch("/api/completion/code", requestInit).then().catch((error) => {
            notifications.show(error)
        })
    }

    const toggleExpand = (treeNode: TreeNode<any, string>) => {
        if(treeNode.type === "file"){
            if(refreshCode){
                refreshCode({
                    codeId: treeNode.codeId,
                    uri: treeNode.uri,
                    suffix: treeNode.name.split(".").pop()
                })
            }
        } else {
            treeNode.expanded = !treeNode.expanded;
            setTree({...tree})
        }
    }

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>, treeNode: TreeNode) => {
        console.log(event);
    }

    const fixStyle = () => {
        if(fileTreeRef.current){
            const divElement: HTMLDivElement = fileTreeRef.current
            divElement?.children[0]?.children[0]?.children[0]?.setAttribute("style", "overflow: visible")
        }
    }

    fixStyle()

    return (
        <>
            <Navbar.Section className={classes.section}>
                <Group className={classes.collectionsHeader} position="apart">
                    <Text size="xs" weight={500} color="dimmed">
                        Code
                    </Text>
                </Group>
            </Navbar.Section>
            <Navbar.Section className={classes.section} grow>
                <div className={classes.collections} ref={fileTreeRef}>
                    <FileTree
                        draggable={false}
                        itemRenderer={itemRenderer}
                        tree={tree}
                        onItemClick={toggleExpand}
                        onContextMenu={(event, treeNode) => onContextMenu(event, treeNode)}
                    />
                </div>
            </Navbar.Section>
        </>
    )
}