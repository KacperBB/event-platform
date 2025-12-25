"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { EventSchema } from "@/schemas";
import * as z from "zod";

export const updateEvent = async (
  id: string,
  values: z.infer<typeof EventSchema>
) => {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ORGANIZER") {
    return { error: "Brak uprawnień" };
  }

  try {
    const status = values.isPublished ? "PUBLISHED" : "DRAFT";

    await prisma.event.update({
      where: { id, creatorId: session.user.id },
      data: {
        ...values,
        status: status,
      },
    });

    return { success: "Wydarzenie zaktualizowane!" };
  } catch (error) {
    return { error: "Błąd podczas aktualizacji" };
  }
};
