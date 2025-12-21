import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EventMap } from "@/components/EventMap"; // Importujemy mapę
import { EventCreator } from "@/components/EventCreator";
import { BookingButton } from "@/components/BookingButton";

export default async function EventPage({ 
  params 
}: { 
  params: Promise<{ eventId: string }> 
}) {
  const { eventId } = await params; 
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
        creator: true,
        bookings: true,
    }
  });

  if (!event) notFound();

  const totalOccupancy = event.bookings.reduce((sum, b) => {
    const isExpired = b.status === "PENDING" && b.expiresAt && new Date() > b.expiresAt;

    if (b.status === "EXPIRED" || isExpired) {
      return sum;
    }

    return sum + b.guestsCount;
  }, 0);
  
  const maxCapacity = event.maxCapacity || 0;
  const isInfinite = !event.maxCapacity;
  const spotsLeft = isInfinite ? Infinity : maxCapacity - totalOccupancy;
  const isFull = !isInfinite && spotsLeft <= 0;

  return (
    <div className="container py-10 space-y-8">
      <section>
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">{event.address}</p>
      </section>

      <section className="h-[400px] w-full">
        <EventMap 
            lat={event.lat} 
            lng={event.lng} 
            title={event.title} 
            address={event.address} 
            />
      </section>
      <BookingButton
          eventId={event.id} 
          disabled={isFull} 
          spotsLeft={isInfinite ? 999 : spotsLeft} 
        />
      <EventCreator 
        name={event.creator.name} 
        image={event.creator.image} 
        description={event.creator.description}
      />
    </div>
  );
}