"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Filter } from "bad-words";
import * as z from "zod";

const filter = new Filter();

export const updateHandle = async (newHandle: string) => {
    const session = await auth();

    if (!session?.user) {
        return {error: "Brak autoryzacji!"};
    }

    const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!handleRegex.test(newHandle)) {
        return { error: " Handle musi mieć 3-20 znaków i nie zawierać spacji"};
    }

    const handleSchema = z.string()
        .min(3, "Minimum 3 znaki")
        .max(20, "Maksimum 20 znaków")
        .regex(/^[a-zA-Z0-9_]+$/, "Tylko litery, cyfry i podkreślniki")
        .refine((val) => !filter.isProfane(val), {
            message: "Ten handle zawiera niedozwolone słownictwo",
        });
    
        const validation = handleSchema.safeParse(newHandle);

        if (!validation.success) {
            return { error: validation.error.issues[0]?.message};
        }

    try {
        const existingHandle = await prisma.user.findUnique({
            where: { handle: newHandle }
        });


        if(existingHandle && existingHandle.id !== session.user.id) {
            return { error: "Ten handle jest już zajęty!"};
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {handle: newHandle }
        });

        revalidatePath("/dashboard");
        return { success: "Handle zaktualizowany!" };
    } catch {
        return { error: "Coś poszło nie tak!" };
    }
}

export const updateDescription = async (newDescription : string) => {
    const session = await auth();

        if (!session?.user) {
        return {error: "Brak autoryzacji!"};
    }

    const handleSchema = z.string()
        .min(15, "Opis musi zawierać minimum 15 znaków")
        .max(200, "Opis może maksymalnie zawierać 200 znaków")
        .refine((val) => !filter.isProfane(val), {
            message: "Ten handle zawiera niedozwolone słownictwo",
        });

        const validation = handleSchema.safeParse(newDescription);
        
         if (!validation.success) {
            return { error: validation.error.issues[0]?.message};
        }

    try {
        const existingHandle = await prisma.user.findUnique({
            where: { handle: newDescription }
        });


        await prisma.user.update({
            where: { id: session.user.id },
            data: {description: newDescription }
        });

        revalidatePath("/dashboard");
        return { success: "Opis zaktualizowany!" };
    } catch {
        return { error: "Coś poszło nie tak!" };
    }
}