import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ORGANIZER" | "ADMIN";
      handle?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    role: "USER" | "ORGANIZER" | "ADMIN";
    handle?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ORGANIZER" | "ADMIN";
    handle?: string | null;
  }
}
