import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/db";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GitHub,
        Google,
        Credentials({

        }),
    ],

    callbacks: {
        async session({session, token}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    }
})