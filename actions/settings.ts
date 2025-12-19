"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateHandle = async (newHandle: string) => {
    const session = await auth();

    if (!session?.user) {
        return {error: "Brak autoryzacji!"};
    }

    const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!handleRegex.test(newHandle)) {
        return { error: " Handle musi mieć 3-20 znaków i nie zawierać spacji"};
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