"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { EventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const updateEvent = async (
  id: string,
  values: z.infer<typeof EventSchema>,
) => {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ORGANIZER") {
    return { error: "Brak uprawnień" };
  }

  const validatedFields = EventSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Nieprawidłowe dane." };
  }

  try {
    const { isPublished, thumbnail, categories, ...data } =
      validatedFields.data;

    const eventStatus = isPublished ? "PUBLISHED" : "DRAFT";

    await prisma.event.update({
      where: {
        id,
        creatorId: session.user.id,
      },
      data: {
        ...data,
        status: eventStatus,
        image: thumbnail || undefined,
        parentId: data.parentId === "none" ? null : data.parentId,

        categories: {
          set: categories.map((catId) => ({ id: catId })),
        },

        price: data.price,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/events/${id}`);

    return { success: "Wydarzenie zaktualizowane!" };
  } catch (error) {
    console.error(error);
    return { error: "Błąd podczas aktualizacji bazy danych" };
  }
};
