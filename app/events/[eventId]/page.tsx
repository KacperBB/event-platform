// app/events/[eventId]/page.tsx
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EventMap } from "@/components/EventMap"; // Importujemy mapę

export default async function EventPage({ 
  params 
}: { 
  params: Promise<{ eventId: string }> 
}) {
  const { eventId } = await params; 
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) notFound();

  return (
    <div className="container py-10 space-y-8">
      <section>
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">{event.address}</p>
      </section>

      {/* Przekazujemy dane z serwera do komponentu klienckiego */}
      <section className="h-[400px] w-full">
        <EventMap lat={event.lat} lng={event.lng} />
      </section>
    </div>
  );
}