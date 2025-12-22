// app/events/[eventId]/ticket/[bookingId]/page.tsx
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { MockLightningPayment } from "@/components/MockLightningPayment";
import { RedirectTimer } from "@/components/RedirectTier";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const session = await auth();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { event: true },
  });

  const now = new Date();
  if (
    booking.status === "PENDING" &&
    booking.expiresAt &&
    now > booking.expiresAt
  ) {
    return <div>Ta rezerwacja wygasła. Spróbuj ponownie</div>;
  }

  if (!booking || booking.userId !== session?.user?.id) notFound();

  // SYMULACJA L402: Jeśli status to PENDING, traktujemy to jako 402
  if (booking.status === "PENDING") {
    return (
      <div className="container max-w-md py-20">
        <div className="border-2 border-amber-500 p-6 rounded-2xl bg-amber-50/50">
          <h2 className="text-xl font-bold text-amber-700 flex items-center gap-2">
            ⚡ L402: Payment Required
          </h2>
          <p className="text-sm text-amber-600 mt-1">
            Status: HTTP 402 | Invoice: lnbc_mock
          </p>

          <div className="mt-6">
            {/* Komponent kliencki do symulacji zapłaty */}
            <MockLightningPayment
              bookingId={bookingId}
              amount={booking.guestsCount * 1000}
            />
          </div>
        </div>
      </div>
    );
  }

  // Widok biletu po opłaceniu (PAID)
  return (
    <div className="container py-20 text-center">
      <div className="bg-green-100 p-10 rounded-full inline-block mb-4">✅</div>
      <h1 className="text-3xl font-bold">Twój Bilet Aktywny!</h1>
      <p>Zapłacono za {booking.guestsCount} osób.</p>
      <RedirectTimer eventId={booking.eventId} />
    </div>
  );
}
