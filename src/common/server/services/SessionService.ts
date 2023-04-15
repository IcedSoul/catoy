import {Session} from "@/common/server/repository/Models";
import {sessions} from "@/common/server/repository/Sessions";

class SessionService{
    createSession = async (sessionId: string, title: string, userEmail: string): Promise<Session> => {
        return sessions.addSession({ sessionId, title, userEmail }).then()
    }
}

export const sessionService = new SessionService()