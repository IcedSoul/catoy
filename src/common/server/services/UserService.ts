import {SessionUser} from "@/common/client/ChatGPTCommon";
import {users} from "@/common/server/repository/Users";
import {User} from "@/common/server/repository/Models";
import {AccountSource, DEFAULT_AVATAR} from "@/common/server/CommonUtils";
import {userUsageLimitsService} from "@/common/server/services/UserUsageLimitService";
import {ErrorMessage, exceptionMessages, ExceptionType} from "@/common/server/utils/ExceptionMessage";
import {notifications} from "@mantine/notifications";

class UserService{

    registerUser = async (email: string, name: string, password: string, source: AccountSource, image: string = DEFAULT_AVATAR): Promise<boolean> => {
        const existingUser = await users.getUserByEmailAndSource(email);
        if(existingUser){
            if(existingUser.sources.includes(source)){
                return false
            }
            existingUser.sources.push(source)
            existingUser.password = password
            existingUser.name = name
            return users.updateUser(existingUser)
        }

        const user: User = {
            sources: [ source ],
            email: email,
            name: name,
            password: password,
            image: image,
        }
        userUsageLimitsService.initializeChatUsage(email)
        return users.addUser(user)
    }

    authenticateUser = async (email: string, password: string, source: AccountSource): Promise<boolean> => {
        const user = await users.getUserByEmailAndSource(email, source)
        if(user){
            if(user.password !== password){
                throw new ErrorMessage(ExceptionType.NORMAL, exceptionMessages.PASSWORD_ERROR)
            }
            return true
        }
        return false
    }

    getSessionUserByEmailAndSource = async (email: string, source?: AccountSource): Promise<SessionUser & {id : string} | null> => {
        return await users.getUserByEmailAndSource(email, source).then((user) => {
            if(user) {
                const sessionUser: SessionUser & {id : string} = {
                    id: user.email,
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