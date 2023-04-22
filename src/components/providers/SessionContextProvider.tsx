import {createContext, ReactNode, useContext} from "react";


interface SessionContextProps {
    refreshSession: () => void,
    setRefreshSession: (refreshSession: () => void) => void,
    refreshMessages: () => void,
    setRefreshMessages: (refreshMessages: () => void) => void,
}

interface SessionContextProviderProps extends SessionContextProps{
    children: ReactNode
}

export const ChatSessionContext = createContext<SessionContextProps>({} as SessionContextProps)

export function useSessionContext (): SessionContextProps {
    const context = useContext(ChatSessionContext)
    if (!context) {
        throw new Error('useSessionContext must be used within a SessionContextProvider')
    }
    return context
}

export function SessionContextProvider({children, refreshSession, setRefreshSession, refreshMessages, setRefreshMessages}: SessionContextProviderProps): JSX.Element {
    return (<ChatSessionContext.Provider value={{ refreshSession, setRefreshSession, refreshMessages, setRefreshMessages}}>{ children }</ChatSessionContext.Provider>)
}
