import {SessionUser} from "@/common/client/ChatGPTCommon";
import {users} from "@/common/server/repository/Users";

class UserService{
    async getSessionUserByEmailAndId(email: string, id?: string): Promise<SessionUser | null> {
        return await users.getUserByTypeAndEmail(email, id).then((user) => {
            if(user) {
                const sessionUser: SessionUser = {
                    email: user.email,
                    name: user.name,
                    image: user.image
                }
                return sessionUser
            }
            return null
        })
    }
}

export const userService = new UserService()