"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const simulatePayment = async (
  bookingId: string,
  shouldSucceed: boolean,
) => {
  // Simulation
  if (!shouldSucceed) {
    return { error: "❌ Płatność odrzucona przez bramkę (Symulacja)" };
  }

  // Price SnapShot
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      event: true,
      order: true,
    },
  });

  if (!booking) return { error: "Nie znaleziono rezerwacji." };

  // Mock hash id
  const mockExternalId = `ln_mock_${Math.random().toString(36).substring(2, 15)}`;

  try {
    // Transaction
    await prisma.$transaction([
      // Update ticket
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          pricePaid: booking.event.price,
        },
      }),

      // Update Order
      ...(booking.orderId
        ? [
            prisma.order.update({
              where: { id: booking.orderId },
              data: {
                status: "PAID",
                externalPaymentId: mockExternalId,
              },
            }),
          ]
        : []),
    ]);

    revalidatePath(`/events/${booking.eventId}/ticket/${bookingId}`);
    return { success: true };
  } catch (error) {
    console.error("Payment Error:", error);
    return { error: "Błąd bazy danych podczas przetwarzania płatności." };
  }
};
