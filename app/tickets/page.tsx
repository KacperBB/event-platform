import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { Calendar, MapPin, QrCode, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function MyTicketsPage() {
  const session = await auth();

  if (!session?.user?.id) return redirect("/auth/login");

  const tickets = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      status: "CONFIRMED",
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container max-w-5xl py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
          <TicketIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Moje Bilety</h1>
          <p className="text-muted-foreground">
            Twoje wejściówki na wydarzenia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-10">
            Nie masz jeszcze żadnych biletów.
          </p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Obrazek */}
              <div className="relative h-40 bg-slate-100">
                <img
                  src={ticket.event.image}
                  alt={ticket.event.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
                  {ticket.guestsCount} os.
                </Badge>
              </div>

              {/* Treść */}
              <div className="p-5 flex flex-col flex-1 gap-4">
                <div>
                  <h3 className="font-bold text-lg line-clamp-1">
                    {ticket.event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Zamówienie #{ticket.orderId?.slice(-6).toUpperCase()}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    {format(ticket.event.date, "dd MMM yyyy, HH:mm", {
                      locale: pl,
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span className="truncate">{ticket.event.address}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <Button className="w-full" asChild>
                    <Link href={`/tickets/${ticket.id}`}>
                      <QrCode className="w-4 h-4 mr-2" />
                      Pokaż kod QR
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
