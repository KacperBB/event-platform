import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Google,
    GitHub,
    Credentials({

    }),
  ],
} satisfies NextAuthConfig;