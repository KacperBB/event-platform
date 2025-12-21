"use server";
import { prisma } from "@/lib/db";

export const simulatePayment = async (bookingId: string, shouldSucceed: boolean = true) => {
  if (!shouldSucceed) {
    // Symulujemy błąd sieci Lightning lub brak środków
    return { error: "L402 Error: Insufficient funds in Lightning Channel." };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" }
    });
    return { success: true };
  } catch (e) {
    return { error: "Błąd bazy danych" };
  }
};