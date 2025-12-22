import { prisma } from "@/lib/db";

export async function publishEvent(eventId: string) {
  await prisma.event.update({
    where: { id: eventId },
    data: { status: "PUBLISHED" },
  });
}
