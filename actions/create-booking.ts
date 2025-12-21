// actions/create-booking.ts
"use server";

import { prisma } from "@/lib/db"; // Używamy Twojego eksportu
import { auth } from "@/auth";     // Import z roota
import { revalidatePath } from "next/cache";

export const createBooking = async (eventId: string, guestsCount: number) => {
    const session = await auth();
    const userId = session?.user?.id;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!userId) {
        return { error: "Musisz być zalogowany, aby zarezerwować miejsce." };
    }

    try {

    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: { bookings: true } 
          },
          bookings: {
            select: { guestsCount: true }
          }
        }
      });

      if (!event) throw new Error("Wydarzenie nie istnieje.");

      const currentOccupancy = event.bookings.reduce((sum, b) => sum + b.guestsCount, 0);

      if (event.maxCapacity) {
        const remaining = event.maxCapacity - currentOccupancy;
        if (guestsCount > remaining) {
          throw new Error(`Brak wolnych miejsc. Zostało tylko: ${remaining}`);
        }
      }

      return await tx.booking.create({
        data: {
          eventId,
          userId,
          guestsCount,
          status: "PENDING",
          expiresAt.
        },
      });
    });

    revalidatePath(`/events/${eventId}`);
    return { success: "Miejsce zostało wstępnie zarezerwowane!", bookingId: result.id };

  } catch (error: any) {
    return { error: error.message || "Wystąpił nieoczekiwany błąd." };
  }
};