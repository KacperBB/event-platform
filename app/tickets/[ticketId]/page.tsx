import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react"; // Import biblioteki
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface TicketPageProps {
  params: Promise<{ ticketId: string }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const session = await auth();

  if (!session) redirect("/auth/login");

  const ticket = await prisma.booking.findUnique({
    where: { id: ticketId },
    include: { event: true, user: true },
  });

  if (!ticket || ticket.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border">
        <div className="bg-slate-900 text-white p-6 text-center">
          <h2 className="text-xl font-bold mb-1">{ticket.event.title}</h2>
          <p className="text-slate-400 text-sm">
            {format(ticket.event.date, "EEEE, d MMMM yyyy", { locale: pl })}
          </p>
        </div>

        <div className="p-8 flex flex-col items-center justify-center space-y-6 bg-white relative">
          <div className="absolute top-0 -left-4 w-8 h-8 bg-slate-50 rounded-full" />
          <div className="absolute top-0 -right-4 w-8 h-8 bg-slate-50 rounded-full" />

          <div className="border-4 border-slate-900 p-4 rounded-xl">
            <QRCodeSVG
              value={ticket.id}
              size={200}
              level="H" // High error correction
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Kod biletu
            </p>
            <p className="font-mono font-bold text-lg">
              {ticket.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <Separator />

        <div className="p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Posiadacz</span>
            <span className="font-semibold">{session.user.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Liczba osób</span>
            <span className="font-semibold">{ticket.guestsCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cena biletu</span>
            <span className="font-semibold">{ticket.pricePaid} PLN</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">
              OPŁACONY
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center text-xs text-muted-foreground">
          Pokaż ten kod przy wejściu na wydarzenie.
        </div>
      </div>
    </div>
  );
}
