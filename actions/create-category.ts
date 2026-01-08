"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const CategorySchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć min. 2 znaki"),
  color: z
    .string()
    .regex(/^#/, "Podaj kolor w formacie HEX (np. #ff0000)")
    .optional(),
});

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
) => {
  const session = await auth();

  if (!session?.user) return { error: "Brak uprawnień" };

  const validated = CategorySchema.safeParse(values);
  if (!validated.success) return { error: "Błędne dane" };

  try {
    await prisma.category.create({
      data: {
        name: validated.data.name,
        color: validated.data.color || "#000000",
      },
    });

    revalidatePath("/events/new");
    revalidatePath("/dashboard");

    return { success: "Dodano nową kategorię!" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Taka kategoria już istnieje." };
    }
    return { error: "Błąd serwera." };
  }
};
