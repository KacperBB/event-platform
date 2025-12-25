import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Ticket } from "lucide-react";
import Link from "next/link";

export async function UserTickets({ userId }: { userId: string }) {
  // Pobieramy rezerwacje użytkownika wraz z danymi o wydarzeniu
  const bookings = await prisma.booking.findMany({
    where: { userId: userId },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">
          Nie masz jeszcze żadnych biletów.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/">Przeglądaj wydarzenia</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="overflow-hidden border-l-4 border-l-primary"
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                ID: {booking.id.slice(-8)}
              </span>
            </div>

            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">
              {booking.event.title}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2 shrink-0" />
                {format(new Date(booking.event.date), "PPP", { locale: pl })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 shrink-0" />
                <span className="line-clamp-1">{booking.event.address}</span>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Status
                </p>
                <span className="text-xs font-medium text-green-600">
                  Opłacono
                </span>
              </div>
              <Button size="sm" asChild>
                <Link href={`/events/${booking.eventId}/ticket/${booking.id}`}>
                  Pokaż bilet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
