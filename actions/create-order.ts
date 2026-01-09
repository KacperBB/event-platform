"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const createOrder = async (eventIds: string[]) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Musisz być zalogowany, aby złożyć zamówienie." };
  }

  if (eventIds.length === 0) {
    return { error: "Koszyk jest pusty." };
  }

  try {
    const uniqueEventIds = [...new Set(eventIds)];

    const eventsFromDb = await prisma.event.findMany({
      where: {
        id: { in: uniqueEventIds },
      },
      select: { id: true, price: true, title: true },
    });

    const itemsToBook = eventIds.map((id) => {
      const event = eventsFromDb.find((e) => e.id === id);
      if (!event) throw new Error(`Nie znaleziono wydarzenia o ID: ${id}`);
      return event;
    });

    const totalAmount = itemsToBook.reduce(
      (sum, event) => sum + event.price,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        totalAmount: totalAmount,
        bookings: {
          create: itemsToBook.map((event) => ({
            userId: session.user.id!,
            eventId: event.id,
            status: "PENDING",
            pricePaid: event.price,
            guestsCount: 1,
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Create Order Error:", error);
    return { error: "Błąd podczas tworzenia zamówienia." };
  }
};
