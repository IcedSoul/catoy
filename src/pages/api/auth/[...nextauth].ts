import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { users } from "@/common/server/repository/Users";
import {randomBytes, randomUUID} from "crypto";
import {User} from "@/common/server/repository/Models";

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
                let user: User | null = null
                if(type === AuthType.LOGIN){
                    user = await users.getUserByTypeAndEmail(email, "credentials")
                    if(user === null){
                        return null
                    }
                    if(user.password !== password){
                        return null
                    }
                    return user
                } else if(type === AuthType.REGISTER){
                    user = {
                        id: 'credentials',
                        email: email,
                        name: name,
                        password: password,
                        image: "https://avatars.githubusercontent.com/u/25154432?v=4"
                    }
                    users.addUser(user).then()
                    console.log(`user return register ${JSON.stringify(user)}`)
                    return user
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
            console.log(`session ${JSON.stringify(session)}, user ${JSON.stringify(user)}`)
            return session // The return type will match the one returned in `useSession()`
        },
        async signIn({account, profile}) {
            return true
        },
        async jwt({ token, user, account, profile, trigger }) {
            if(!user?.email){ return token }
            const type: string = account?.provider || 'unknown'
            const nowUser = await users.getUserByTypeAndEmail(user.email)
            if(trigger === "signUp" || !nowUser){
                const saveUser: User = {
                    id: type,
                    email: user.email || '',
                    name: user.name || '',
                    password: 'github',
                    image: user.image || ''
                }
                users.addUser(saveUser).then()
            }
            console.log(`token ${JSON.stringify(token)}, user ${JSON.stringify(user)}`)
            return token
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    debug: true,
}

export default NextAuth(authOptions)