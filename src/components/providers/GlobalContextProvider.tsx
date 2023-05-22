import {createContext, ReactNode, useContext} from "react";
import {CodeProps, FileProps, InsertCodeProps} from "@/common/client/CompleteCommon";

interface GlobalContextProps {
    refreshSession: () => void,
    setRefreshSession: (refreshSession: () => void) => void,
    refreshMessages: () => void,
    setRefreshMessages: (refreshMessages: () => void) => void,
    refreshCode: (codeProps: CodeProps) => void,
    setRefreshCode: (refreshCode: (codeProps: CodeProps) => void) => void,
    refreshFile: (fileProps: FileProps) => void,
    setRefreshFile: (refreshFile: (fileProps: FileProps) => void) => void,
    refreshInsertCode: (insertCode: InsertCodeProps) => void,
    setRefreshInsertCode: (refreshInsertCode: (insertCode: InsertCodeProps) => void) => void,
}

interface GlobalContextProviderProps extends GlobalContextProps{
    children: ReactNode
}

export const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps)

export function useGlobalContext (): GlobalContextProps {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error('useSessionContext must be used within a GlobalContextProvider')
    }
    return context
}

export function GlobalContextProvider({children, refreshSession, setRefreshSession, refreshMessages, setRefreshMessages, refreshCode, setRefreshCode, refreshFile, setRefreshFile, refreshInsertCode, setRefreshInsertCode}: GlobalContextProviderProps): JSX.Element {
    return (<GlobalContext.Provider value={{ refreshSession, setRefreshSession, refreshMessages, setRefreshMessages, refreshCode, setRefreshCode, refreshFile, setRefreshFile, refreshInsertCode, setRefreshInsertCode}}>{ children }</GlobalContext.Provider>)
}
