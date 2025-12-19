import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      handle?: string | null
    } & DefaultSession["user"]
  }
}