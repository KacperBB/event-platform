"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";


export const createOrder = async (eventIds: string[]) => {
    const session = await auth();

    if(!session?.user?.id) {
        return { error: "Musisz byc zalogowany, aby złoży zamówienie." };
    }

    if (eventIds.length === 0) {
        return { error: "Koszyk jest pusty. "};
    }

    try {
        const events = await prisma.event.findMany({
            where: {
                id: { in: eventIds },
            },
            select: { id: true, price: true, title: true }
        });

        const totalAmount = events.reduce((sum, event) => sum + event.price, 0);

const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        totalAmount: totalAmount,
        bookings: {
          create: events.map((event) => ({
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