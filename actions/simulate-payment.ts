"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const simulatePayment = async (
  orderId: string, 
  shouldSucceed: boolean
) => {
  if (!shouldSucceed) {
    return { error: "❌ Płatność odrzucona przez bramkę (Symulacja)" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { bookings: true }, 
  });

  if (!order) return { error: "Nie znaleziono zamówienia." };

  const mockSessionId = `pay_ses_${Math.random().toString(36).substring(2, 15)}`;

  try {
    await prisma.$transaction(async (tx) => {
      
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentSessionId: mockSessionId, 
        },
      });

      await tx.booking.updateMany({
        where: { orderId: orderId },
        data: {
          status: "CONFIRMED",
        },
      });
    });

    // Odświeżamy stronę checkoutu, żeby pokazać sukces
    revalidatePath(`/checkout/${orderId}`);
    return { success: true };

  } catch (error) {
    console.error("Payment Error:", error);
    return { error: "Błąd bazy danych podczas przetwarzania płatności." };
  }
};