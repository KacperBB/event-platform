// app/events/new/page.tsx
import { EventForm } from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">🎉 Stwórz nowe wydarzenie</h1>
        <p className="text-muted-foreground">
          Wypełnij poniższe dane, aby dodać swoje wydarzenie do mapy.
        </p>
      </div>
      
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <EventForm />
      </div>
    </div>
  );
}