import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await auth();
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!event) notFound();
  if (event.creatorId !== session?.user?.id) redirect("/");

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Edytuj wydarzenie</h1>
      <EventForm initialData={event} id={event.id} />
    </div>
  );
}
