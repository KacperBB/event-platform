// lib/booking-logic.ts

export type MockBooking = {
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  guestsCount: number;
  expiresAt: Date | null;
};

export const calculateActiveOccupancy = (bookings: MockBooking[]): number => {
  const now = new Date();
  return bookings.reduce((sum, b) => {
    const isExpired =
      b.status === "PENDING" && b.expiresAt && now > b.expiresAt;

    if (b.status === "EXPIRED" || isExpired || b.status === "CANCELLED") {
      return sum;
    }

    const count = Math.max(b.guestsCount || 0, 0);

    return sum + count;
  }, 0);
};
