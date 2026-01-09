import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { TicketCard } from "@/components/tickets/TicketCard"; // Zaraz to stworzymy
import { CalendarDays, Ticket as TicketIcon } from "lucide-react";
import Link from "next/link";

export default async function MyTicketsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

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
    <div className="container py-10 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
          <TicketIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Moje Bilety</h1>
          <p className="text-muted-foreground">
            Zarządzaj swoimi wejściówkami na wydarzenia.
          </p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border rounded-2xl border-dashed">
          <CalendarDays className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Brak biletów</h2>
          <p className="text-muted-foreground mb-6">
            Nie masz jeszcze żadnych aktywnych biletów.
          </p>
          <Link
            href="/events"
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Przeglądaj wydarzenia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}