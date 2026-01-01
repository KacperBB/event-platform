// actions/favorite-actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const toggleFavorite = async (eventId: string) => {
  const session = await auth();
  if (!session?.user) throw new Error("Musisz być zalogowany");

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_eventId: { userId: session.user.id!, eventId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id!, eventId },
    });
  }

  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
};
