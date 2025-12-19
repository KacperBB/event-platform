// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs"; // Tu jest bezpieczny!

import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";
import { LoginSchema } from "@/schemas";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
        console.log("Tworzenie nowego użytkownika, generuje handle dla:", user.email);

        if (user.email) {
            const baseHandle = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
            const generatedHandle = `${baseHandle}_${Math.floor(1000 + Math.random() * 9000)}`;

            await prisma.user.update ({
                where: { id: user.id },
                data: { handle: generatedHandle },
            });

            console.log("Zapisano handle:", generatedHandle);
        }
    }
  },
    callbacks: {
    async session({ session, token }) {
        if (token.sub && session.user) {
            session.user.id = token.sub;
        }

        if (session.user?.id) {
                const dbUser = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { handle: true } 
                });
                session.user.handle = dbUser?.handle;
            }

        return session;
    },

    async jwt({ token }) {
        if (!token.sub) return token;

        const existingUser = await prisma.user.findUnique({
            where: { id: token.sub }
        });

        if (!existingUser) return token;

        token.handle = existingUser.handle;
        return token;
    }
  },
  ...authConfig,
  providers: [
    ...authConfig.providers, 
    Credentials({
  async authorize(credentials) {

    if (!credentials.email || !credentials.password) return null;


    const user = await prisma.user.findUnique({
      where: { email: credentials.email as string }
    });

    if (!user || !user.password) return null;

    const passwordsMatch = await bcrypt.compare(
      credentials.password as string,
      user.password
    );

    if (passwordsMatch) return user;

    return null; 
  },
}),
  ]
});