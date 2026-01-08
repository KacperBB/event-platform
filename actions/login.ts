"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const vaildatedFields = LoginSchema.safeParse(values);

  if (!vaildatedFields.success) {
    return { error: "Niepoprawne pola!" };
  }

  const { email, password } = vaildatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser || !existingUser.password) {
    return { error: "Email nie istnieje!" };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    return { error: "Dane logowania są nieprawidłowe!" };
  }

  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Błędne dane logowania!" };
        default:
          return { error: "Coś poszło nie tak!" };
      }
    }

    throw error;
  }
};
