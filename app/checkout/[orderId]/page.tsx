import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { OrderPaymentForm } from "@/components/OrderPaymentForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();

  if (!session) redirect("/auth/login");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      bookings: {
        include: { event: true },
      },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  // Payment OK
  if (order.status === "PAID") {
    return (
      <div className="container max-w-md py-20 flex flex-col items-center text-center space-y-6">
        <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold">Dziękujemy!</h1>
        <p className="text-muted-foreground">
          Twoje zamówienie #{order.id.slice(-6)} zostało opłacone. Bilety
          zostały wysłane na Twój profil.
        </p>
        <a
          href="/dashboard"
          className="text-sky-600 font-medium hover:underline"
        >
          Wróć do moich biletów &rarr;
        </a>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 grid md:grid-cols-2 gap-10">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShoppingBag className="h-8 w-8" />
          Podsumowanie
        </h1>
        <div className="divide-y border rounded-2xl overflow-hidden">
          {order.bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{booking.event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(booking.event.date, "dd.MM.yyyy")}
                </p>
              </div>
              <p className="font-medium">{booking.pricePaid} PLN</p>
            </div>
          ))}
          <div className="p-4 bg-slate-50 flex justify-between items-center font-bold text-lg">
            <span>Razem do zapłaty</span>
            <span>{order.totalAmount} PLN</span>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Płatność</h2>
        <OrderPaymentForm orderId={order.id} amount={order.totalAmount} />

        <div className="text-xs text-muted-foreground text-center">
          <p>Bezpieczna transakcja zabezpieczona przez Mock Protocol.</p>
          <p>Klikając zapłać, akceptujesz regulamin wydarzenia.</p>
        </div>
      </div>
    </div>
  );
}
