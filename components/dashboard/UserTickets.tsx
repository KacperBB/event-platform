import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Ticket, AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils"; // Narzędzie Shadcn do klas CSS
import Link from "next/link";

export async function UserTickets({ userId }: { userId: string }) {
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
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        Nie masz biletów.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => {
        const isCancelled = booking.event.status === "CANCELLED";

        return (
          <Card
            key={booking.id}
            className={cn(
              "overflow-hidden transition-all",
              isCancelled
                ? "opacity-60 grayscale bg-slate-50 border-slate-200"
                : "border-l-4 border-l-primary shadow-sm",
            )}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    isCancelled ? "bg-slate-200" : "bg-primary/10",
                  )}
                >
                  <Ticket
                    className={cn(
                      "w-5 h-5",
                      isCancelled ? "text-slate-500" : "text-primary",
                    )}
                  />
                </div>
                {isCancelled && (
                  <div className="flex items-center gap-1 text-red-600 text-[10px] font-bold uppercase bg-red-50 px-2 py-1 rounded border border-red-200">
                    <AlertCircle className="w-3 h-3" /> Odwołane
                  </div>
                )}
              </div>

              <h3
                className={cn(
                  "font-bold text-lg mb-2 line-clamp-1",
                  isCancelled &&
                    "text-slate-600 line-through decoration-slate-400",
                )}
              >
                {booking.event.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(booking.event.date), "PPP", { locale: pl })}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {booking.event.address}
                </div>
              </div>

              <div className="pt-4 border-t">
                {isCancelled ? (
                  <p className="text-xs font-medium text-slate-500 italic text-center">
                    Organizator odwołał to wydarzenie.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-green-600 text-center">
                      Bilet jest ważny
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/tickets/${booking.id}`}>
                          <Ticket className="w-4 h-4 mr-2" />
                          Bilet
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/events/${booking.event.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Wydarzenie
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
