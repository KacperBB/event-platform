"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getCoordsFromAddress } from "@/lib/google";
import { EventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const createEvent = async (values: z.infer<typeof EventSchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Musisz być zalogowany!" };
  }

  if (session.user.role !== "ORGANIZER") {
    return { error: "Tylko organizatorzy mogą tworzyć wydarzenia" };
  }

  const validatedFields = EventSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Błędne pola formularza!" };
  }

  const data = validatedFields.data;

  const [hours, minutes] = data.startTime.split(":").map(Number);
  const finalDateTime = new Date(data.date);
  finalDateTime.setHours(hours, minutes);

  let finalLat = data.lat;
  let finalLng = data.lng;

  if (finalLat === 0 || finalLng === 0) {
    const coords = await getCoordsFromAddress(data.address);

    if (!coords) {
      return {
        error: "📍 Nie udało się odnaleźć tego adresu na mapie.",
      };
    }

    finalLat = coords.lat;
    finalLng = coords.lng;
  }

  const eventStatus = data.isPublished ? "PUBLISHED" : "DRAFT";

  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || "",
        address: data.address,
        image: data.thumbnail,
        date: finalDateTime,
        startTime: finalDateTime,
        lat: finalLat,
        lng: finalLng,
        creatorId: session.user.id,
        bookingDeadline: data.bookingDeadline,
        maxCapacity: data.maxCapacity,
        status: eventStatus,
        parentId: data.parentId === "none" ? null : data.parentId,
        categories: {
          connect: data.categories.map((catId) => ({ id: catId })),
        },
        price: data.price,
      },
    });

    revalidatePath("/dashboard");
    return { success: "Wydarzenie zostało utworzone!", id: event.id };
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    return { error: "Błąd podczas zapisu do bazy danych." };
  }
};
