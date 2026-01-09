"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const getOrganizerStats = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const events = await prisma.event.findMany({
    where: { creatorId: session.user.id },
    include: {
      bookings: {
        where: { status: "CONFIRMED" },
        select: { pricePaid: true },
      },
    },
  });

  const stats = events.map((event) => {
    const revenue = event.bookings.reduce(
      (sum, booking) => sum + booking.pricePaid,
      0,
    );
    const salesCount = event.bookings.length;

    return {
      eventId: event.id,
      title: event.title,
      views: event.viewsCount,
      sales: salesCount,
      revenue: revenue,
      conversionRate:
        event.viewsCount > 0
          ? ((salesCount / event.viewsCount) * 100).toFixed(1) + "%"
          : "0%",
    };
  });

  const totalRevenue = stats.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalSales = stats.reduce((acc, curr) => acc + curr.sales, 0);
  const totalViews = stats.reduce((acc, curr) => acc + curr.views, 0);

  return {
    overview: { totalRevenue, totalSales, totalViews },
    events: stats,
  };
};
