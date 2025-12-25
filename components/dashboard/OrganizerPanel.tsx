import React from "react";
import Link from "next/link";
import { Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { prisma } from "@/lib/db"; // Upewnij się, że ścieżka do db jest poprawna
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { DeleteEventButton } from "./DeleteEventButton";

interface OrganizerPanelProps {
  userId: string;
}

const OrganizerPanel = async ({ userId }: OrganizerPanelProps) => {
  const events = await prisma.event.findMany({
    where: {
      creatorId: userId,
    },
    orderBy: {
      date: "asc",
    },
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

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <Badge
                variant={event.status === "PUBLISHED" ? "default" : "secondary"}
              >
                {event.status}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(event.date), "dd MMMM yyyy", { locale: pl })}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.address}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild title="Edytuj">
              <Link href={`/events/${event.id}/edit`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>

            <DeleteEventButton id={event.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizerPanel;
