import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import {mongoClient} from "@/common/mongo/MongoClient";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import {AuthOptions} from "next-auth/src";
import type { Adapter } from "next-auth/adapters";

function MongoAdapter(): Adapter {
    return MongoDBAdapter(mongoClient.mongoClientPromise, {
        databaseName: 'catoy'
    })
}

export interface Provider {
    clientId: string
    clientSecret: string
}


export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
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
        }),

    ],
    secret: process.env.SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {

    },
    callbacks: {
        async jwt({ token }) {
            token.userRole = "admin"
            return token
        },
    }
}
export default NextAuth(authOptions)