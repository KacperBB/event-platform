"use server";
import { prisma } from "@/lib/db";

export const simulatePayment = async (bookingId: string) => {
  // W produkcji tutaj sprawdzalibyśmy "preimage" z sieci Lightning
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" }
  });
  return { success: true };
};