import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EventMap } from "@/components/EventMap";
import { EventCreator } from "@/components/EventCreator";
import { BookingButton } from "@/components/BookingButton";
import BookingCountDown from "@/components/BookingCountDown";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { creator: true, bookings: true,},
  });

  if (!event) notFound();

  const potentialParents = await prisma.event.findMany({
    where: {
      parentId: null,
      NOT: {
        id: eventId,
      },
    },
    select: {
      id: true,
      title: true,
      date: true,
    },
  });

  const totalOccupancy = event.bookings.reduce((sum, b) => {
    const isExpired =
      b.status === "PENDING" && b.expiresAt && new Date() > b.expiresAt;
    return b.status === "EXPIRED" || isExpired ? sum : sum + b.guestsCount;
  }, 0);

  console.log(event.maxCapacity);
  const spotsLeft = event.maxCapacity
    ? event.maxCapacity - totalOccupancy
    : Infinity;
  const canBook =
    (!event.maxCapacity || spotsLeft > 0) &&
    (!event.bookingDeadline || new Date() < event.bookingDeadline);

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      {event.thumbnail && (
        <div className="w-full h-[300px] overflow-hidden rounded-3xl border shadow-sm">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {event.title}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              {event.address}
            </p>
          </section>

          <article className="prose prose-slate max-w-none dark:prose-invert">
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">
              O wydarzeniu
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: event.description || "" }}
            />
          </article>

          <section className="h-[400px] w-full rounded-2xl overflow-hidden border shadow-inner">
            <EventMap
              lat={event.lat}
              lng={event.lng}
              title={event.title}
              address={event.address}
            />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-6 p-6 border rounded-3xl bg-white shadow-sm space-y-4">
            {event.bookingDeadline && (
              <BookingCountDown deadline={event.bookingDeadline} />
            )}

            <div className="flex flex-col gap-1 text-center py-2">
              <span className="text-2xl font-bold">
                {event.maxCapacity ? `${spotsLeft}` : "∞"}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Dostępnych miejsc
              </span>
            </div>

            <BookingButton
              eventId={event.id}
              disabled={!canBook}
              spotsLeft={event.maxCapacity ? spotsLeft : 999}
            />

            <EventCreator
              name={event.creator.name}
              image={event.creator.image}
              description={event.creator.description}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
