import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const getorganizerAnalytics = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const events = await prisma.event.findMany({
    where: { creatorId: session.user.id },
    include: {
      bookings: {
        where: { status: "CONFIRMED" },
      },
    },
  });

  const stats = events.map((event) => {
    const ticketsSold = event.bookings.length;

    const revenue = event.bookings.reduce(
      (sum, booking) => sum + booking.pricePaid,
      0,
    );

    return {
      title: event.title,
      ticketsSold,
      revenue,
      maxCapacity: event.maxCapacity || 0,
      occupancy: event.maxCapacity
        ? (ticketsSold / event.maxCapacity) * 100
        : 0,
    };
  });

  const totalRevenue = stats.reduce((sum, item) => sum + item.revenue, 0);
  const totalTickets = stats.reduce((sum, item) => sum + item.ticketsSold, 0);

  return {
    events: stats,
    totalRevenue,
    totalTickets,
  };
};
