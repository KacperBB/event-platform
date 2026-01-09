"use client";

import Image from "next/image";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { MapPin, Calendar, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface TicketCardProps {
  ticket: {
    id: string;
    guestsCount: number;
    pricePaid: number;
    event: {
      id: string;
      title: string;
      image: string;
      date: Date;
      address: string;
      startTime: Date;
    };
  };
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const eventDate = new Date(ticket.event.date);

  return (
    <div className="group relative bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="relative h-40 w-full bg-slate-100">
        <Image
          src={ticket.event.image}
          alt={ticket.event.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-slate-900 hover:bg-white">
            {ticket.guestsCount} os.
          </Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
          {ticket.event.title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>
              {format(eventDate, "d MMMM yyyy", { locale: pl })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span className="line-clamp-1">{ticket.event.address}</span>
          </div>
        </div>

        <div className="pt-4 border-t flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
             <Link href={`/tickets/${ticket.id}`}>
                <QrCode className="w-4 h-4 mr-2" />
                Pokaż kod
             </Link>
          </Button>
        </div>
      </div>
      
      <div className="absolute top-40 -left-2 w-4 h-4 bg-background rounded-full" />
      <div className="absolute top-40 -right-2 w-4 h-4 bg-background rounded-full" />
    </div>
  );
};