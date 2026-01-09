import React from "react";
import Link from "next/link";
import { Edit, Trash2, Calendar, MapPin, View, BarChart3, CreditCard, Eye, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { DeleteEventButton } from "./DeleteEventButton";
import { CldImage } from "next-cloudinary";
import { EventImage } from "../EventImage";

interface OrganizerPanelProps {
  userId: string;
}

const OrganizerPanel = async ({ userId }: OrganizerPanelProps) => {
  // Pobieramy wszystkie eventy organizatora wraz ze statystykami
  const events = await prisma.event.findMany({
    where: { creatorId: userId },
    include: {
      bookings: {
        where: { status: "CONFIRMED" }, // Liczymy tylko potwierdzone
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (events.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">
          Nie stworzyłeś jeszcze żadnych wydarzeń.
        </p>
        <Button asChild className="mt-4">
          <Link href="/events/new">Stwórz pierwsze wydarzenie</Link>
        </Button>
      </div>
    );
  }

  // Agregacja danych
  const totalEvents = events.length;
  const totalViews = events.reduce((acc, e) => acc + e.viewsCount, 0);
  
  // Sumujemy liczbę sprzedanych biletów (bookings.length)
  const totalTicketsSold = events.reduce((acc, e) => acc + e.bookings.length, 0);
  
  // Sumujemy przychód (pricePaid z każdego biletu)
  const totalRevenue = events.reduce((acc, e) => {
    const eventRevenue = e.bookings.reduce((sum, b) => sum + b.pricePaid, 0);
    return acc + eventRevenue;
  }, 0);

  return (
    <div className="space-y-8">
      {/* KAFELKI ZE STATYSTYKAMI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Całkowity Przychód" 
          value={`${totalRevenue.toFixed(2)} PLN`} 
          icon={CreditCard} 
          description="Suma ze sprzedaży biletów"
        />
        <StatsCard 
          title="Sprzedane Bilety" 
          value={totalTicketsSold.toString()} 
          icon={Users} 
          description="Liczba potwierdzonych rezerwacji"
        />
        <StatsCard 
          title="Wyświetlenia Ofert" 
          value={totalViews.toString()} 
          icon={Eye} 
          description="Łączna liczba odsłon Twoich wydarzeń"
        />
        <StatsCard 
          title="Twoje Wydarzenia" 
          value={totalEvents.toString()} 
          icon={BarChart3} 
          description="Liczba opublikowanych eventów"
        />
      </div>

      {/* TABELA Z POSZCZEGÓLNYMI EVENTAMI */}
      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b bg-slate-50">
          <h3 className="font-semibold text-lg">Szczegóły sprzedaży</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Nazwa Wydarzenia</th>
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Wyświetlenia</th>
                <th className="px-6 py-3 font-medium">Sprzedaż</th>
                <th className="px-6 py-3 font-medium text-right">Przychód</th>
                <th className="px-6 py-3 font-medium text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => {
                const eventRevenue = event.bookings.reduce((sum, b) => sum + b.pricePaid, 0);
                return (
                  <tr key={event.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{event.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                        {format(event.date, "dd.MM.yyyy")}
                    </td>
                    <td className="px-6 py-4">{event.viewsCount}</td>
                    <td className="px-6 py-4">
                        {event.bookings.length} / {event.maxCapacity || "∞"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                        {eventRevenue.toFixed(2)} PLN
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild title="Edytuj">
                          <Link href={`/events/${event.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild title="Zobacz">
                          <Link href={`/events/${event.id}`}>
                            <View className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteEventButton id={event.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Pomocniczy komponent do Kafelków
function StatsCard({ title, value, icon: Icon, description }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default OrganizerPanel;
