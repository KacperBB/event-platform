"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const cancelEvent = async (id: string) => {
  const session = await auth();

  if (!session?.user?.id) return { error: "Brak sesji użytkownika" };

  try {
    console.log("Próba odwołania eventu:", id, "przez:", session.user.id);

    const updatedEvent = await prisma.event.update({
      where: {
        id: id,
        creatorId: session.user.id, // Upewnij się, że to Ty jesteś właścicielem
      },
      data: {
        status: "CANCELLED",
      },
    });

    revalidatePath("/dashboard");
    return { success: "Wydarzenie zostało odwołane!" };
  } catch (error: any) {
    console.error("SZCZEGÓŁY BŁĘDU PRISMA:", error.message);

    if (error.code === "P2025") {
      return {
        error: "Nie znaleziono wydarzenia lub nie masz do niego uprawnień.",
      };
    }

    return { error: `Błąd serwera: ${error.message}` };
  }
};
