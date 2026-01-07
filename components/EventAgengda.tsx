"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart"; // Używamy globalnego stanu

interface SubEvent {
  id: string;
  title: string;
  date: Date | null;
  startTime: Date | null;
  address: string; 
  price?: number;
}

interface EventAgendaProps {
  subEvents: SubEvent[];
}

export const EventAgenda = ({ subEvents }: EventAgendaProps) => {
  const cart = useCart();

  const groupedEvents = useMemo(() => {
    // Poprawiono typ klucza na 'string' (mała litera)
    const groups: Record<string, SubEvent[]> = {};

    subEvents.forEach((event) => {
      const dateKey = event.date 
        ? format(new Date(event.date), "yyyy-MM-dd") 
        : "Nieokreślono";
        
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });

    // Sortowanie chronologiczne
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => 
        // Poprawiono składnię opcjonalnego łańcucha ?.
        (a.startTime?.getTime() || 0) - (b.startTime?.getTime() || 0)
      );
    });

    return groups;
  }, [subEvents]);

  const handleAddToCart = (sub: SubEvent) => {
    cart.addItem({
      id: sub.id,
      title: sub.title,
      price: sub.price || 0,
      date: sub.date,
      location: sub.address
    });
  };

  if (subEvents.length === 0) return null;

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Calendar className="h-5 w-5 text-sky-600" />
            <h3 className="text-xl font-bold italic">
              {date !== "Nieokreślono"
                ? format(new Date(date), "EEEE, d MMMM", { locale: pl })
                : "Dodatkowe punkty programu"}
            </h3>
          </div>

          <div className="grid gap-4">
            {events.map((sub) => (
              <div
                key={sub.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border bg-white hover:shadow-md transition-all border-slate-100"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sky-600 font-medium text-sm">
                    <Clock className="h-3 w-3" />
                    {sub.startTime ? format(new Date(sub.startTime), "HH:mm") : "TBA"}
                  </div>
                  <h4 className="font-bold text-lg">{sub.title}</h4>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <MapPin className="h-3 w-3" />
                    {sub.address}
                  </div>
                </div>

                {/* Poprawiono: Tylko jeden blok z przyciskiem */}
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {sub.price ? `${sub.price} PLN` : "Wstęp wolny"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full gap-2 bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => handleAddToCart(sub)}
                  >
                    <Ticket className="h-4 w-4" />
                    Dodaj bilet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};