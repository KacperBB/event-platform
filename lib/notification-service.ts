import { prisma } from "@/lib/db";

export const notifySubscribers = async (
  eventId: string,
  title: string,
  message: string
) => {
  const subscriptions = await prisma.notificationSubscription.findMany({
    where: { eventId },
    select: { userId: true },
  });

  if (subscriptions.length === 0) return;

  await prisma.notification.createMany({
    data: subscriptions.map((sub) => ({
      userId: sub.userId,
      title,
      message,
      link: `/events/${eventId}`,
    })),
  });
};
