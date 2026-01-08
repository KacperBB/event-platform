import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EventMap } from "@/components/EventMap";
import { EventCreator } from "@/components/EventCreator";
import BookingCountDown from "@/components/BookingCountDown";
import { AddToCartButton } from "@/components/events/AddToCartButton";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, MapPin, Tag } from "lucide-react";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { creator: true, bookings: true },
  });

  if (!event) notFound();

  // Logika obliczania dostępnych miejsc
  const totalOccupancy = event.bookings.reduce((sum, b) => {
    const isExpired =
      b.status === "PENDING" && b.expiresAt && new Date() > b.expiresAt;
    const isActive =
      ["CONFIRMED", "USED"].includes(b.status) ||
      (b.status === "PENDING" && !isExpired);

    return isActive ? sum + b.guestsCount : sum;
  }, 0);

  const spotsLeft = event.maxCapacity
    ? event.maxCapacity - totalOccupancy
    : Infinity;

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      {event.image && (
        <div className="w-full h-[350px] md:h-[450px] overflow-hidden rounded-[2rem] border shadow-sm relative group">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Badge Kategorii */}
          {event.category && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-sm flex items-center gap-2">
              <Tag className="h-4 w-4 text-sky-600" />
              {event.category}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-600" />
                <span className="font-medium">{event.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-600" />
                <span className="font-medium">
                  {format(event.date, "d MMMM yyyy, HH:mm", { locale: pl })}
                </span>
              </div>
            </div>
          </section>

          <article className="prose prose-slate prose-lg max-w-none">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">
              O wydarzeniu
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: event.description || "" }}
            />
          </article>

          <section className="h-[400px] w-full rounded-[2rem] overflow-hidden border shadow-inner bg-slate-100">
            {/* Tu wstaw swoją mapę, upewniając się, że przekazujesz poprawne propsy */}
            <EventMap lat={event.lat} lng={event.lng} />
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="space-y-6">
          <div className="sticky top-24 p-8 border rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 space-y-6">
            <div className="text-center space-y-1 border-b pb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
                Cena biletu
              </p>
              <p className="text-4xl font-extrabold text-slate-900">
                {event.price > 0 ? `${event.price} PLN` : "Darmowy"}
              </p>
            </div>

            {event.bookingDeadline && (
              <BookingCountDown deadline={event.bookingDeadline} />
            )}

            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
              <span className="text-sm font-medium text-slate-600">
                Dostępne miejsca
              </span>
              <span className="text-lg font-bold text-slate-900">
                {event.maxCapacity ? spotsLeft : "Bez limitu"}
              </span>
            </div>

            {/* NOWY PRZYCISK KOSZYKA */}
            <AddToCartButton
              event={{
                id: event.id,
                title: event.title,
                price: event.price,
                date: event.date,
                address: event.address,
                maxCapacity: event.maxCapacity,
              }}
              spotsLeft={spotsLeft}
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
