import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import {users} from "@/common/server/repository/Users";
import {randomBytes, randomUUID} from "crypto";
import {User} from "@/common/server/repository/Models";
import {userService} from "@/common/server/services/UserService";
import {AccountSource} from "@/common/server/CommonUtils";

enum AuthType {
    LOGIN = "login",
    REGISTER = "register"
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                name: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                const { type, name, email, password  } = credentials
                if(type === AuthType.LOGIN){
                    const authResult = await userService.authenticateUser(email, password, AccountSource.CREDENTIALS)
                    if(authResult) {
                        return await userService.getSessionUserByEmailAndSource(email, AccountSource.CREDENTIALS)
                    }
                } else if(type === AuthType.REGISTER){
                    const registerResult = await userService.registerUser(email, name, password, AccountSource.CREDENTIALS)
                    if(registerResult){
                        return await userService.getSessionUserByEmailAndSource(email, AccountSource.CREDENTIALS)
                    }
                }
                return null
            },
        }),
        GithubProvider({
            // @ts-ignore
            clientId: process.env.GITHUB_ID,
            // @ts-ignore
            clientSecret: process.env.GITHUB_SECRET,
            // @ts-ignore
            scope: "read:user",
        }),
        GoogleProvider({
            // @ts-ignore
            clientId: process.env.GOOGLE_ID,
            // @ts-ignore
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        }
    },
    callbacks: {
        session({ session, token, user }) {
            return session // The return type will match the one returned in `useSession()`
        },
        async signIn({account, profile}) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async jwt({ token, user, account, profile, trigger }) {
            if(!user?.email || trigger !== "signIn"){ return token }
            const type: string = account?.provider || 'unknown'
            const source: AccountSource | null = type === 'github' ? AccountSource.GITHUB : type === 'google' ? AccountSource.GOOGLE : null
            if(!source){
                return token
            }
            userService.registerUser(user.email, user.name || user.email, 'None', source).then()
            return token
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    debug: true,
}

export default NextAuth(authOptions)