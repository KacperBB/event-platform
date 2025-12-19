"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { LoginSchema } from "@/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const vaildatedFields = LoginSchema.safeParse(values);

    if (!vaildatedFields.success) {
        return { error: "Niepoprawne pola!"};
    }

    const { email, password} = vaildatedFields.data;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser || !existingUser.password) {
        return { error: "Email nie istnieje!" };
    }

    const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
    );

    if (!passwordMatch) {
        return { error: "Dane logowania są nieprawidłowe!" };
    }

    return { success: "Zalogowano pomyślnie!" };
}