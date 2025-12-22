"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getCoordsFromAddress } from "@/lib/google";
import { EventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createEvent = async (values: z.infer<typeof EventSchema>) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Musisz być zalogowany!" };
  }

  if (session.user.role !== "ORGANIZER") {
    return { error: "Tylko organizatorzy mogą tworzyć wydarzenia" };
  }

  let finalLat = values.lat;
  let finalLng = values.lng;
  const status = values.isPublished ? "PUBLISHED" : "DRAFT";
  if (finalLat === 0 || finalLng === 0) {
    const coords = await getCoordsFromAddress(values.address);

    if (!coords) {
      return {
        error: "📍 Nie udało się odnaleźć tego adresu na mapie.",
      };
    }

    finalLat = coords.lat;
    finalLng = coords.lng;
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: values.title,
        description: values.description,
        address: values.address,
        date: values.date,
        lat: finalLat,
        lng: finalLng,
        creatorId: session.user.id,
        bookingDeadline: values.bookingDeadline,
        maxCapacity: values.maxCapacity,
        status: status,
      },
    });

    revalidatePath("/dashboard");
    return { success: "Wydarzenie zostało utworzone!", id: event.id };
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    return { error: "Błąd podczas zapisu do bazy danych." };
  }
};
